# apps/reservas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReservaViewSet, stripe_webhook

router = DefaultRouter()
router.register(r'reservas', ReservaViewSet, basename='reserva')

urlpatterns = [
    path('', include(router.urls)),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
]

