from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, InvitationViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet)
router.register(r'invitations', InvitationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]