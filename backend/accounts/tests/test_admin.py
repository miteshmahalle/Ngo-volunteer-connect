from django.test import Client

client = Client()


def test_pending_users_without_admin():
    response = client.get("/api/auth/admin/pending-users/")

    assert response.status_code in [401, 403]


def test_verify_user_without_admin():
    response = client.patch(
        "/api/auth/admin/verify-user/test-user-id/",
        content_type="application/json",
    )

    assert response.status_code in [401, 403, 404]
