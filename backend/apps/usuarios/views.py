# apps/usuarios/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permissions import *
from .models import Usuario, Persona, Arrendador, Cliente
from .serializers import UsuarioSerializer, PersonaSerializer, ArrendadorSerializer, ClienteSerializer
import logging

# Configurar el logger
logger = logging.getLogger(__name__)

class UsuarioViewSet(viewsets.ModelViewSet):
    # Asegúrate de definir explícitamente el queryset
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == 'register':
            permission_classes = [permissions.AllowAny]
        elif self.action == 'create':
            permission_classes = [RegistroPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [PropietarioOAdministrador]
        elif self.action == 'list':
            permission_classes = [EsAdministrador]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['PATCH'], permission_classes=[PropietarioOAdministrador])
    def update_profile(self, request, pk=None):
        user = self.get_object()

        # Asegurarse de que solo el propietario o un admin pueden hacer cambios
        if request.user.tipo_usuario != 'admin' and user.id_usuario != request.user.id_usuario:
            return Response(
                {"error": "No tienes permiso para modificar este perfil"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        usuario_serializer = UsuarioSerializer(user, data=request.data.get('usuario', {}), partial=True)
        
        logger.info(f"Update Profile Request - User: {request.user}")
        logger.info(f"Request User ID: {request.user.id_usuario}")
        logger.info(f"Target User ID: {pk}")
        logger.info(f"User Type: {request.user.tipo_usuario}")

        try:
            persona = user.persona
            persona_serializer = PersonaSerializer(persona, data=request.data.get('persona', {}), partial=True)
            
            if usuario_serializer.is_valid() and persona_serializer.is_valid():
                usuario_serializer.save()
                persona_serializer.save()
                
                # Recuperar datos actualizados
                updated_user = Usuario.objects.get(pk=pk)
                return Response(UsuarioSerializer(updated_user).data)
            
            errors = {}
            if not usuario_serializer.is_valid():
                errors['usuario'] = usuario_serializer.errors
            if not persona_serializer.is_valid():
                errors['persona'] = persona_serializer.errors
            
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Persona.DoesNotExist:
            return Response({"error": "No se encontró información de persona"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = UsuarioSerializer(data=request.data)
        
        if serializer.is_valid():
            # Crear usuario
            user = serializer.save(tipo_usuario='cliente')
            
            # Crear Persona si se proporcionan datos
            persona_data = request.data.get('persona', {})
            if persona_data:
                persona_data['usuario'] = user
                persona_serializer = PersonaSerializer(data=persona_data)
                if persona_serializer.is_valid():
                    persona_serializer.save()
                    
            if user.tipo_usuario == 'admin':
                Arrendador.objects.create(
                    usuario=user, 
                    nombre=f"{user.persona.nombre} {user.persona.apellido}"
                )
            # Crear Cliente automáticamente para usuarios de tipo 'cliente'
            if user.tipo_usuario == 'cliente':
                Cliente.objects.create(usuario=user)

            # Generar tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UsuarioSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [PersonaPermission]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        if self.request.user.tipo_usuario == 'admin':
            return Persona.objects.all()
        return Persona.objects.filter(usuario=self.request.user)

class ArrendadorViewSet(viewsets.ModelViewSet):
    queryset = Arrendador.objects.all()
    serializer_class = ArrendadorSerializer
    permission_classes = [ArrendadorPermission]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        if self.request.user.tipo_usuario == 'admin':
            return Arrendador.objects.all()
        elif self.request.user.tipo_usuario == 'arrendador':
            return Arrendador.objects.filter(usuario=self.request.user)
        return Arrendador.objects.none()

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [ClientePermission]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        if self.request.user.tipo_usuario == 'admin':
            return Cliente.objects.all()
        elif self.request.user.tipo_usuario == 'cliente':
            return Cliente.objects.filter(usuario=self.request.user)
        return Cliente.objects.none()

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
