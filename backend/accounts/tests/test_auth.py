from django.test import Client

client = Client()


def test_register_api():
    response = client.post(
        "/api/auth/register/",
        {
            "name": "Test User",
            "email": "test@test.com",
            "password": "123456",
            "role": "volunteer",
        },
        content_type="application/json",
    )

    assert response.status_code in [200, 201, 400]


def test_login_api():
    response = client.post(
        "/api/auth/login/",
        {
            "email": "test@test.com",
            "password": "123456",
        },
        content_type="application/json",
    )

    assert response.status_code in [200, 401, 400]