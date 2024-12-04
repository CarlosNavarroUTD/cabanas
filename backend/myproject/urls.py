from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # Add this import
from django.conf.urls.static import static  # Add this import
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.usuarios.views import CurrentUserView, UsuarioViewSet 

class HealthCheckView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response("OK")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/usuarios/<int:pk>/update_profile/', UsuarioViewSet.as_view({'patch': 'update_profile'}), name='usuario-update-profile'),
    path('api/usuarios/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/usuarios/register/', UsuarioViewSet.as_view({'post': 'register'}), name='usuario-register'),
    path('api/actividades/', include('apps.actividades.urls')),
    path('api/cabanas/', include('apps.cabanas.urls')),
    #path('api/reservas/', include('apps.reservas.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('health/', HealthCheckView.as_view(), name='health_check'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)