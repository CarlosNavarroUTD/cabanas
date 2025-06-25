# apps/responses/urls.py 
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RespuestaViewSet, TagViewSet

# Creamos un enrutador para las rutas de respuestas
router = DefaultRouter()
router.register(r'respuestas', RespuestaViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Incluimos todas las rutas generadas por el router
]
