from dataclasses import dataclass

import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from common.mongo import get_db
from common.objectid import to_object_id


@dataclass
class MongoUser:
    id: str
    email: str
    role: str
    name: str
    is_verified: bool
    is_authenticated: bool = True


class MongoJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode("utf-8")
        if not header:
            return None

        parts = header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise exceptions.AuthenticationFailed(
                "Authorization header must be Bearer token"
            )

        try:
            payload = jwt.decode(parts[1], settings.JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            role = payload.get("role")
            user = get_db().users.find_one({"_id": to_object_id(user_id), "role": role})
        except Exception as exc:
            raise exceptions.AuthenticationFailed("Invalid or expired token") from exc

        if not user:
            raise exceptions.AuthenticationFailed("User not found")

        mongo_user = MongoUser(
            id=str(user["_id"]),
            email=user["email"],
            role=user["role"],
            name=user.get("name", ""),
            is_verified=bool(user.get("is_verified", False)),
        )
        return mongo_user, payload
