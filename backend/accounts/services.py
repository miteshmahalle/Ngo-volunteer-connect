from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from django.conf import settings
from pymongo import ASCENDING

from common.mongo import get_db


VALID_ROLES = {"ngo", "volunteer", "admin"}


def ensure_indexes() -> None:
    db = get_db()
    db.users.create_index([("email", ASCENDING)], unique=True)
    db.users.create_index(
        [("profile.registration_number", ASCENDING)],
        unique=True,
        sparse=True
    )

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_token(user: dict) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user["_id"]),
        "role": user["role"],
        "email": user["email"],
        "iat": now,
        "exp": now + timedelta(minutes=settings.JWT_EXPIRY_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def public_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user["email"],
        "role": user["role"],
        "city": user.get("city", ""),
        "state": user.get("state", ""),
        "phone": user.get("phone", ""),
        "is_verified": bool(user.get("is_verified", False)),
        "profile": user.get("profile", {}),
        "created_at": user.get("created_at"),
    }

