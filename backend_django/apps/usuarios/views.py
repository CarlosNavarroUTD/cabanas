# apps/usuarios/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.conf import settings
from allauth.socialaccount.models import SocialAccount
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import urllib.parse
import requests
import json
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Usuario, Persona
from .serializers import UsuarioSerializer, PersonaSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Si el objeto tiene 'usuario' (Persona), comparar con el request.user
        if hasattr(obj, 'usuario'):
            return obj.usuario == request.user or request.user.is_staff
        # Si el objeto es un usuario directamente
        return obj == request.user or request.user.is_staff

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Usuario.objects.all()
        return Usuario.objects.filter(id_usuario=self.request.user.id_usuario)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        if request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:  # GET
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Persona.objects.all()
        return Persona.objects.filter(usuario=self.request.user)



# ========== VISTAS PARA TOKENS CON INFORMACIÓN DEL USUARIO ==========
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Añadir la información del usuario autenticado
        serializer = UsuarioSerializer(self.user)
        data['user'] = serializer.data

        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ========== VISTAS PARA GOOGLE OAUTH ==========

@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_redirect(request):
    """
    Endpoint que redirige a Google OAuth
    """
    try:
        # Obtener configuración de Google OAuth
        client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
        
        if not client_id:
            return JsonResponse({'error': 'Google OAuth no configurado'}, status=500)
        
        # Construir URL de autorización de Google
        google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
        
        # IMPORTANTE: Esta URL debe coincidir exactamente con la registrada en Google Console
        redirect_uri = getattr(settings, 'GOOGLE_REDIRECT_URI', 'https://axol-backend.fly.dev/api/auth/google/callback/')
        
        params = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': 'openid email profile',
            'response_type': 'code',
            'access_type': 'online',
            'prompt': 'select_account'
        }
        
        auth_url = f"{google_auth_url}?{urllib.parse.urlencode(params)}"
        
        print(f"Redirigiendo a Google OAuth: {auth_url}")
        print(f"Redirect URI configurada: {redirect_uri}")
        
        return redirect(auth_url)
        
    except Exception as e:
        print(f"Error en google_auth_redirect: {str(e)}")
        return JsonResponse({'error': f'Error interno: {str(e)}'}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthCallbackView(View):
    """
    Vista que maneja el callback de Google OAuth y redirige al frontend con los datos
    """
    def get(self, request):
        print("=== INICIO CALLBACK DE GOOGLE ===")
        print(f"Query params: {request.GET}")
        
        # Verificar si hay error en la respuesta de Google
        error = request.GET.get('error')
        if error:
            print(f"Error de Google: {error}")
            frontend_url = f"{settings.FRONTEND_URL}/auth/google/callback?error=google_auth_error"
            return redirect(frontend_url)
        
        # Obtener el código de autorización
        code = request.GET.get('code')
        if not code:
            print("No se recibió código de autorización")
            frontend_url = f"{settings.FRONTEND_URL}/auth/google/callback?error=no_code"
            return redirect(frontend_url)
        
        print(f"Código recibido: {code[:20]}...")
        
        try:
            # Intercambiar código por tokens con Google
            print("Intercambiando código por tokens...")
            token_data = self._exchange_code_for_tokens(code, request)
            print("Tokens obtenidos exitosamente")
            
            # Obtener información del usuario de Google
            print("Obteniendo información del usuario...")
            user_info = self._get_user_info_from_google(token_data['access_token'])
            print(f"Usuario obtenido: {user_info.get('email')}")
            
            # Crear o obtener usuario en Django
            print("Creando/obteniendo usuario en Django...")
            user = self._get_or_create_user(user_info)
            print(f"Usuario Django: {user.email}")
            
            # Generar tokens JWT
            print("Generando tokens JWT...")
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Preparar datos del usuario
            user_data = {
                'id': user.id_usuario,
                'email': user.email,
                'nombre_usuario': user.nombre_usuario,
                'tipo_usuario': user.tipo_usuario
            }
            
            print("=== ÉXITO - Redirigiendo al frontend con tokens ===")
            
            # Redirigir al frontend con los datos como parámetros de URL
            frontend_url = f"{settings.FRONTEND_URL}/auth/google/callback"
            params = {
                'success': 'true',
                'access': access_token,
                'refresh': refresh_token,
                'user': json.dumps(user_data)
            }
            
            redirect_url = f"{frontend_url}?{urllib.parse.urlencode(params)}"
            return redirect(redirect_url)
            
        except Exception as e:
            print(f"Error en Google OAuth: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # Redirigir al frontend con error
            frontend_url = f"{settings.FRONTEND_URL}/auth/google/callback?error=auth_failed&message={urllib.parse.quote(str(e))}"
            return redirect(frontend_url)
    
    def _exchange_code_for_tokens(self, code, request):
        """Intercambia el código de autorización por tokens de acceso"""
        token_url = "https://oauth2.googleapis.com/token"
        redirect_uri = getattr(settings, 'GOOGLE_REDIRECT_URI', 'https://axol-backend.fly.dev/api/auth/google/callback/')
        
        data = {
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri,
        }
        
        print(f"Enviando request a Google token endpoint con redirect_uri: {redirect_uri}")
        
        response = requests.post(token_url, data=data)
        
        if not response.ok:
            print(f"Error en token exchange: {response.status_code} - {response.text}")
            response.raise_for_status()
        
        return response.json()
    
    def _get_user_info_from_google(self, access_token):
        """Obtiene información del usuario desde Google"""
        user_info_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
        response = requests.get(user_info_url)
        
        if not response.ok:
            print(f"Error obteniendo user info: {response.status_code} - {response.text}")
            response.raise_for_status()
        
        return response.json()
    
    def _get_or_create_user(self, user_info):
        """Crea o obtiene un usuario basado en la información de Google"""
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        email = user_info.get('email')
        
        if not email:
            raise ValueError("Email no proporcionado por Google")
        
        # Buscar usuario existente
        try:
            user = User.objects.get(email=email)
            print(f"Usuario existente encontrado: {user.email}")
            return user
        except User.DoesNotExist:
            # Crear nuevo usuario - solo con campos que existen en tu modelo
            print(f"Creando nuevo usuario para: {email}")
            
            # Crear nombre_usuario a partir del email
            nombre_usuario = email.split('@')[0]
            
            # Asegurar que el nombre_usuario sea único
            counter = 1
            original_nombre = nombre_usuario
            while User.objects.filter(nombre_usuario=nombre_usuario).exists():
                nombre_usuario = f"{original_nombre}_{counter}"
                counter += 1
            
            user = User.objects.create_user(
                email=email,
                nombre_usuario=nombre_usuario,
                tipo_usuario='usuario'  # Valor por defecto
            )
            
            # Crear el registro en Persona si es necesario
            from .models import Persona
            persona, created = Persona.objects.get_or_create(
                usuario=user,
                defaults={
                    'nombre': user_info.get('given_name', ''),
                    'apellido': user_info.get('family_name', '')
                }
            )
            if created:
                print(f"Persona creada para {user.email}")
            else:
                print(f"Persona ya existía para {user.email}")
            
            return user