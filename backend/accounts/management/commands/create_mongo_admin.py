from datetime import datetime, timezone

from django.core.management.base import BaseCommand, CommandError
from pymongo.errors import DuplicateKeyError

from accounts.services import ensure_indexes, hash_password
from common.mongo import get_db


class Command(BaseCommand):
    help = "Create an admin user in the MongoDB users collection"

    def add_arguments(self, parser):
        parser.add_argument("--name", required=True)
        parser.add_argument("--email", required=True)
        parser.add_argument("--password", required=True)

    def handle(self, *args, **options):
        ensure_indexes()
        now = datetime.now(timezone.utc).isoformat()
        user = {
            "name": options["name"].strip(),
            "email": options["email"].strip().lower(),
            "password": hash_password(options["password"]),
            "role": "admin",
            "phone": "",
            "city": "",
            "state": "",
            "is_verified": True,
            "profile": {"designation": "Platform Admin"},
            "created_at": now,
            "updated_at": now,
        }

        try:
            get_db().users.insert_one(user)
        except DuplicateKeyError as exc:
            raise CommandError("A user with this email already exists") from exc

        self.stdout.write(self.style.SUCCESS(f"Admin created: {user['email']}"))
