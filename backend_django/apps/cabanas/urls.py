# apps/cabanas/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CabanaViewSet, ServicioViewSet, ImagenCabanaViewSet, ResenaViewSet

router = DefaultRouter()
router.register(r'cabanas', CabanaViewSet, basename='cabana')
router.register(r'servicios', ServicioViewSet)
router.register(r'imagenes', ImagenCabanaViewSet, basename='imagen-cabana')
router.register(r'resenas', ResenaViewSet, basename='resena')

urlpatterns = [
    path('', include(router.urls)),
]