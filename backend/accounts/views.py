from datetime import datetime, timezone
import re

from pymongo.errors import DuplicateKeyError
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.mongo import get_db
from common.objectid import to_object_id

from .permissions import IsAdminUserRole
from .services import (
    VALID_ROLES,
    create_token,
    ensure_indexes,
    hash_password,
    public_user,
    verify_password,
)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    data = request.data
    role = data.get("role")
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    city = str(data.get("city", "")).strip()
    state = str(data.get("state", "")).strip()

    email_pattern = r"^[a-zA-Z0-9._%+-]+@gmail\.com$"
    phone_pattern = r"^\d{10}$"
    aadhaar_pattern = r"^\d{12}$"
    reg_pattern = r"^\d+$"
    if role not in {"ngo", "volunteer"}:
        return Response(
            {"detail": "Role must be ngo or volunteer"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not name or not email or not password or not phone or not city or not state:
        return Response(
            {"detail": "Name, email, password, phone, city, and state are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not re.match(email_pattern, email):
        return Response(
            {"detail": "Email must be a valid Gmail address like mitesh123@gmail.com"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not re.match(phone_pattern, phone):
        return Response(
            {"detail": "Phone number must be exactly 10 digits"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if role == "ngo":
        registration_number = str(data.get("registration_number", "")).strip()
        focus_areas = data.get("focus_areas", [])

        if not registration_number:
            return Response(
                {"detail": "NGO registration number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not re.match(reg_pattern, registration_number):
            return Response(
                {"detail": "Registration number must contain only digits"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not focus_areas:
            return Response(
                {"detail": "Focus areas are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    else:  # volunteer
        skills = data.get("skills", [])
        aadhaar_number = str(data.get("aadhaar_number", "")).strip()

        if not skills:
            return Response(
                {"detail": "Skills are required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not aadhaar_number:
            return Response(
                {"detail": "Aadhaar number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not re.match(aadhaar_pattern, aadhaar_number):
            return Response(
                {"detail": "Aadhaar number must be exactly 12 digits"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    ensure_indexes()
    user = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "role": role,
        "phone": phone,
        "city": city,
        "state": state,
        "is_verified": False,
        "profile": data.get("profile", {}),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    if role == "ngo":
        user["profile"].update(
            {
                "registration_number": registration_number,
                "focus_areas": focus_areas,
                "website": data.get("website", ""),
            }
        )
    else:
        user["profile"].update(
            {
                "skills": skills,
                "aadhaar_number": aadhaar_number,
                "availability": data.get("availability", ""),
                "interests": data.get("interests", []),
            }
        )

    try:
        result = get_db().users.insert_one(user)
    except DuplicateKeyError:
        return Response(
            {"detail": "Email is already registered"}, status=status.HTTP_409_CONFLICT
        )

    user["_id"] = result.inserted_id
    token = create_token(user)
    return Response(
        {"token": token, "user": public_user(user)}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    email = str(request.data.get("email", "")).strip().lower()
    password = request.data.get("password", "")
    role = request.data.get("role")

    if role and role not in VALID_ROLES:
        return Response({"detail": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    query = {"email": email}
    if role:
        query["role"] = role

    user = get_db().users.find_one(query)
    if not user or not verify_password(password, user["password"]):
        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    return Response({"token": create_token(user), "user": public_user(user)})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    user = get_db().users.find_one({"_id": to_object_id(request.user.id)})
    return Response({"user": public_user(user)})


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    data = request.data
    user_id = to_object_id(request.user.id)

    user = get_db().users.find_one({"_id": user_id})
    if not user:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    update_data = {}

    allowed_fields = ["name", "phone", "city", "state"]

    for field in allowed_fields:
        if field in data:
            update_data[field] = str(data.get(field, "")).strip()

    profile_updates = {}

    if user["role"] == "ngo":
        for field in ["registration_number", "focus_areas", "website"]:
            if field in data:
                profile_updates[f"profile.{field}"] = data.get(field)

    elif user["role"] == "volunteer":
        for field in ["skills", "availability", "interests"]:
            if field in data:
                profile_updates[f"profile.{field}"] = data.get(field)

        if "aadhaar_number" in data:
            aadhaar_number = str(data.get("aadhaar_number", "")).strip()

            if not re.match(r"^\d{12}$", aadhaar_number):
                return Response(
                    {"detail": "Aadhaar number must be exactly 12 digits"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            update_data["aadhaar_number"] = aadhaar_number
            profile_updates["profile.aadhaar_number"] = aadhaar_number

    update_data.update(profile_updates)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    updated_user = get_db().users.find_one_and_update(
        {"_id": user_id},
        {"$set": update_data},
        return_document=True,
    )

    return Response({"user": public_user(updated_user)})


@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def pending_users(_request):
    users = get_db().users.find(
        {"is_verified": False, "role": {"$in": ["ngo", "volunteer"]}}
    )
    return Response({"users": [public_user(user) for user in users]})


@api_view(["PATCH"])
@permission_classes([IsAdminUserRole])
def verify_user(request, user_id):
    try:
        object_id = to_object_id(user_id)
    except ValueError:
        return Response(
            {"detail": "Invalid user id"}, status=status.HTTP_400_BAD_REQUEST
        )

    result = get_db().users.find_one_and_update(
        {"_id": object_id, "role": {"$in": ["ngo", "volunteer"]}},
        {
            "$set": {
                "is_verified": bool(request.data.get("is_verified", True)),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
        return_document=True,
    )
    if not result:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"user": public_user(result)})


@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def platform_stats(_request):
    db = get_db()
    return Response(
        {
            "ngos": db.users.count_documents({"role": "ngo"}),
            "volunteers": db.users.count_documents({"role": "volunteer"}),
            "pending_verification": db.users.count_documents(
                {"is_verified": False, "role": {"$in": ["ngo", "volunteer"]}}
            ),
            "opportunities": db.opportunities.count_documents({}),
        }
    )


@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def all_registered_users(_request):
    users = (
        get_db()
        .users.find({"role": {"$in": ["ngo", "volunteer"]}})
        .sort("created_at", -1)
    )

    return Response({"users": [public_user(user) for user in users]})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    user_id = to_object_id(request.user.id)
    data = request.data

    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")
    confirm_password = data.get("confirm_password", "")

    if not old_password or not new_password or not confirm_password:
        return Response(
            {"detail": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if new_password != confirm_password:
        return Response(
            {"detail": "New password and confirm password do not match"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = get_db().users.find_one({"_id": user_id})

    if not user or not verify_password(old_password, user["password"]):
        return Response(
            {"detail": "Old password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Update password
    get_db().users.update_one(
        {"_id": user_id},
        {
            "$set": {
                "password": hash_password(new_password),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )

    return Response({"detail": "Password changed successfully"})
