from django.urls import path

from . import views

urlpatterns = [
    path("", views.opportunities),
    path("<str:opportunity_id>/apply/", views.apply_to_opportunity),
    path("applications/received/", views.received_applications),
]
