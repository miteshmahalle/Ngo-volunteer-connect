from django.test import Client

client = Client()


def test_get_opportunities():
    response = client.get("/api/opportunities/")

    assert response.status_code in [200, 401, 403]


def test_create_opportunity_without_auth():
    response = client.post(
        "/api/opportunities/",
        {
            "title": "Food Donation Drive",
            "description": "Help distribute food",
            "location": "Pune",
        },
        content_type="application/json",
    )

    assert response.status_code in [401, 403]


def test_apply_opportunity_without_auth():
    response = client.post(
        "/api/opportunities/test-id/apply/",
        content_type="application/json",
    )

    assert response.status_code in [401, 403, 404]