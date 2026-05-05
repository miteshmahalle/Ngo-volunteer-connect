
from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(_request):
    return Response({"status": "ok", "service": "ngo-volunteer-connect"})


urlpatterns = [
   
    path("api/health/", health_check),
    path("api/auth/", include("accounts.urls")),
    path("api/opportunities/", include("opportunities.urls")),
]

