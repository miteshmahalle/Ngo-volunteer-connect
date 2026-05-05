from datetime import datetime, timezone

from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.mongo import get_db
from common.objectid import serialize_document, to_object_id

def serialize_opportunity(item: dict) -> dict:
    db = get_db()

    serialized = serialize_document(item)

    ngo_id = serialized.get("ngo_id", "")
    serialized["ngo_id"] = str(ngo_id)

    ngo = None
    if ngo_id:
        try:
            ngo = db.users.find_one({"_id": to_object_id(str(ngo_id))})
        except ValueError:
            ngo = None

    serialized["ngo_name"] = ngo.get("name", "") if ngo else serialized.get("ngo_name", "")
    serialized["ngo_email"] = ngo.get("email", "") if ngo else ""
    serialized["ngo_phone"] = ngo.get("phone", "") if ngo else ""

    for application in serialized.get("applications", []):
        application["volunteer_id"] = str(application.get("volunteer_id", ""))

    return serialized


@api_view(["GET", "POST"])
def opportunities(request):
    db = get_db()
    if request.method == "GET":
        city = request.query_params.get("city")
        focus = request.query_params.get("focus")
        query = {"status": "open"}
        if city:
            query["city"] = {"$regex": city, "$options": "i"}
        if focus:
            query["focus_area"] = {"$regex": focus, "$options": "i"}

        items = db.opportunities.find(query).sort("created_at", -1)
        return Response({"opportunities": [serialize_opportunity(item) for item in items]})

    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    if request.user.role != "ngo":
        return Response({"detail": "Only NGOs can create opportunities"}, status=status.HTTP_403_FORBIDDEN)
    if not request.user.is_verified:
        return Response({"detail": "NGO must be verified before posting"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    required = ["title", "description", "city", "state", "focus_area", "start_date"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return Response({"detail": f"Missing fields: {', '.join(missing)}"}, status=status.HTTP_400_BAD_REQUEST)

    item = {
        "ngo_id": to_object_id(request.user.id),
        "ngo_name": request.user.name,
        "title": data["title"],
        "description": data["description"],
        "city": data["city"],
        "state": data["state"],
        "focus_area": data["focus_area"],
        "start_date": data["start_date"],
        "end_date": data.get("end_date", ""),
        "required_volunteers": int(data.get("required_volunteers", 1)),
        "status": "open",
        "applications": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    result = db.opportunities.insert_one(item)
    item["_id"] = result.inserted_id
    return Response({"opportunity": serialize_opportunity(item)}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def apply_to_opportunity(request, opportunity_id):
    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    if request.user.role != "volunteer":
        return Response({"detail": "Only volunteers can apply"}, status=status.HTTP_403_FORBIDDEN)
    if not request.user.is_verified:
        return Response({"detail": "Volunteer must be verified before applying"}, status=status.HTTP_403_FORBIDDEN)

    try:
        object_id = to_object_id(opportunity_id)
    except ValueError:
        return Response({"detail": "Invalid opportunity id"}, status=status.HTTP_400_BAD_REQUEST)

    application = {
        "volunteer_id": to_object_id(request.user.id),
        "volunteer_name": request.user.name,
        "message": request.data.get("message", ""),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = get_db().opportunities.update_one(
        {"_id": object_id, "applications.volunteer_id": {"$ne": to_object_id(request.user.id)}},
        {"$push": {"applications": application}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if result.matched_count == 0:
        return Response({"detail": "Opportunity not found or already applied"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"detail": "Application submitted"})

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def received_applications(request):
    db = get_db()

    opportunities = list(db.opportunities.find({
        "ngo_id": to_object_id(request.user.id)
    }))

    received = []

    for opportunity in opportunities:
        for application in opportunity.get("applications", []):
            volunteer = db.users.find_one({
                "_id": application.get("volunteer_id")
            })

            received.append({
                "opportunity_id": str(opportunity["_id"]),
                "opportunity_title": opportunity.get("title", ""),
                "focus_area": opportunity.get("focus_area", ""),
                "volunteer": {
                    "name": volunteer.get("name", "") if volunteer else "",
                    "email": volunteer.get("email", "") if volunteer else "",
                    "phone": volunteer.get("phone", "") if volunteer else "",
                    "city": volunteer.get("city", "") if volunteer else "",
                    "state": volunteer.get("state", "") if volunteer else "",
                    "profile": volunteer.get("profile", {}) if volunteer else {},
                },
            })

    return Response({"applications": received})