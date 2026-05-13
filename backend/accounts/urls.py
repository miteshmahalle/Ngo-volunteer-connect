from django.urls import path

from . import views

urlpatterns = [
    path("register/", views.register),
    path("login/", views.login),
    path("me/", views.me),
    path("profile/update/", views.update_profile),
    path("admin/pending-users/", views.pending_users),
    path("admin/verify-user/<str:user_id>/", views.verify_user),
    path("admin/stats/", views.platform_stats),
    path("admin/users/", views.all_registered_users),
    path("change-password/", views.change_password),
]
