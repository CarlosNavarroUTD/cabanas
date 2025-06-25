from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Tienda
from .serializers import StoreSerializer

class IsOwnerOrTeamMember(permissions.BasePermission):
    """
    Permiso personalizado para permitir acceso solo al propietario 
    o miembros del equipo asociado a la tienda.
    """
    
    def has_object_permission(self, request, view, obj):
        # El propietario siempre tiene acceso completo
        if obj.propietario == request.user:
            return True
            
        # Verificar si el usuario es miembro de algún equipo asociado a la tienda
        user_teams = request.user.teams.filter(role__in=['ADMIN', 'MEMBER']).values_list('team', flat=True)
        store_teams = obj.teams.all().values_list('id', flat=True)
        
        # Si hay intersección entre los equipos del usuario y los de la tienda
        if set(user_teams).intersection(set(store_teams)):
            # Solo lectura para miembros, escritura solo para admins o propietario
            if request.method in permissions.SAFE_METHODS:
                return True
            # Para operaciones de escritura, verificar si es admin del equipo
            return request.user.teams.filter(
                team__in=store_teams, 
                role='ADMIN'
            ).exists()
            
        return False

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Tienda.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrTeamMember]
    lookup_field = 'slug'
    
    def get_queryset(self):
        user = self.request.user
        # Mostrar tiendas propias y tiendas de equipos donde es miembro
        user_teams = user.teams.filter(role__in=['ADMIN', 'MEMBER']).values_list('team', flat=True)
        return Tienda.objects.filter(
            Q(propietario=user) | Q(teams__in=user_teams)
        ).distinct()
    
    def perform_create(self, serializer):
        # El usuario actual se convierte en propietario
        serializer.save(propietario=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='add-team')
    def add_team(self, request, slug=None):
        """Asociar un equipo a la tienda"""
        store = self.get_object()
        team_id = request.data.get('team_id')
        
        if not team_id:
            return Response(
                {"detail": "Se requiere el ID del equipo."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el usuario sea propietario o admin del equipo
        try:
            from apps.teams.models import Team
            team = Team.objects.get(id=team_id)
            
            # Verificar permisos: propietario de la tienda O admin del equipo
            is_store_owner = store.propietario == request.user
            is_team_admin = request.user.teams.filter(
                team=team, 
                role='ADMIN'
            ).exists()
            
            if not (is_store_owner or is_team_admin):
                return Response(
                    {"detail": "No tienes permisos para asociar este equipo."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Verificar que el equipo no esté ya asociado
            if store.teams.filter(id=team_id).exists():
                return Response(
                    {"detail": "El equipo ya está asociado a esta tienda."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            store.teams.add(team)
            
            return Response(
                {"detail": "Equipo asociado correctamente."},
                status=status.HTTP_200_OK
            )
            
        except Team.DoesNotExist:
            return Response(
                {"detail": "El equipo no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'], url_path='remove-team')
    def remove_team(self, request, slug=None):
        """Desasociar un equipo de la tienda"""
        store = self.get_object()
        team_id = request.data.get('team_id')
        
        if not team_id:
            return Response(
                {"detail": "Se requiere el ID del equipo."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Solo el propietario puede desasociar equipos
        if store.propietario != request.user:
            return Response(
                {"detail": "Solo el propietario puede desasociar equipos."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from apps.teams.models import Team
            team = Team.objects.get(id=team_id)
            
            # Verificar que el equipo esté asociado
            if not store.teams.filter(id=team_id).exists():
                return Response(
                    {"detail": "El equipo no está asociado a esta tienda."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            store.teams.remove(team)
            
            return Response(
                {"detail": "Equipo desasociado correctamente."},
                status=status.HTTP_200_OK
            )
            
        except Team.DoesNotExist:
            return Response(
                {"detail": "El equipo no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='my-stores')
    def my_stores(self, request):
        """Obtener todas las tiendas del usuario (propias y de equipos)"""
        stores = self.get_queryset()
        serializer = self.get_serializer(stores, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='preview')
    def preview(self, request, slug=None):
        """Obtener vista previa de la tienda para el frontend público"""
        store = self.get_object()
        # Serializar solo los campos necesarios para la vista pública
        public_data = {
            'nombre': store.nombre,
            'slug': store.slug,
            'plantilla': store.plantilla,
            'logo': store.logo.url if store.logo else None,
            'color_primario': store.color_primario,
            'color_secundario': store.color_secundario,
            'fuente': store.fuente,
            'configuracion_extra': store.configuracion_extra,
            'dominio_personalizado': store.dominio_personalizado,
        }
        return Response(public_data)