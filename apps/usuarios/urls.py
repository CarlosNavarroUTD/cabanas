# apps/usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, PersonaViewSet
from . import views

# Creamos un enrutador para gestionar las URLs automáticamente
router = DefaultRouter()
router.register(r'users', UsuarioViewSet)
router.register(r'personas', PersonaViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Incluimos todas las rutas generadas por el router
    path('auth/google/', views.google_auth_redirect, name='google_auth_redirect'),
    path('auth/google/callback/', views.GoogleAuthCallbackView.as_view(), name='google_auth_callback'),

]

