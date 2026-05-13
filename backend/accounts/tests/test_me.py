from django.test import Client

client = Client()


def test_me_without_token():
    response = client.get("/api/auth/me/")

    assert response.status_code in [401, 403]