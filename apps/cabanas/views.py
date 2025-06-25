# apps/cabanas/views.py

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Cabana, Resena, ImagenCabana, Ubicacion, Servicio
from .serializers import (
    CabanaListSerializer, CabanaDetailSerializer, CabanaManagementSerializer,
    ResenaCreateSerializer, ResenaSerializer, ImagenCabanaCreateSerializer,
    UbicacionSerializer, ServicioSerializer
)
from apps.teams.models import Team


class IsTeamMember(permissions.BasePermission):
    """
    Permiso personalizado para verificar que el usuario sea miembro del equipo
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'team'):
            return obj.team.members.filter(user=request.user).exists()
        return False


class IsTeamMemberOrReadOnly(permissions.BasePermission):
    """
    Permiso que permite lectura a todos pero escritura solo a miembros del equipo
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'team'):
            return obj.team.members.filter(user=request.user).exists()
        return False


# ========================= VISTAS PÚBLICAS (CLIENTES) =========================

class CabanaListView(generics.ListAPIView):
    """
    Vista pública para listar cabañas disponibles
    Todos los usuarios pueden ver las cabañas disponibles
    """
    serializer_class = CabanaListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ubicacion__estado', 'ubicacion__ciudad', 'capacidad']
    search_fields = ['nombre', 'descripcion', 'ubicacion__ciudad', 'ubicacion__estado']
    ordering_fields = ['costo_por_noche', 'capacidad', 'creada_en']
    ordering = ['-creada_en']

    def get_queryset(self):
        # Solo cabañas disponibles
        return Cabana.objects.filter(estado='disponible').select_related('ubicacion').prefetch_related('servicios', 'imagenes', 'resenas')


class CabanaDetailView(generics.RetrieveAPIView):
    """
    Vista pública para ver detalles de una cabaña
    Incluye imágenes, servicios, ubicación y reseñas
    """
    serializer_class = CabanaDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Cabana.objects.filter(estado='disponible').select_related('ubicacion').prefetch_related(
            'servicios', 'imagenes', 'resenas__usuario__persona'
        )


# ========================= VISTAS DE GESTIÓN (ARRENDADORES) =========================

class CabanaManagementListView(generics.ListCreateAPIView):
    """
    Vista para que los arrendadores gestionen sus cabañas
    GET: Lista cabañas de los equipos del usuario
    POST: Crea nueva cabaña
    """
    serializer_class = CabanaManagementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['team', 'estado', 'ubicacion__estado']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'costo_por_noche', 'creada_en']
    ordering = ['-creada_en']

    def get_queryset(self):
        # Solo cabañas de equipos donde el usuario es miembro
        user_teams = Team.objects.filter(members__user=self.request.user)
        return Cabana.objects.filter(team__in=user_teams).select_related('team', 'ubicacion').prefetch_related('servicios', 'imagenes')

    def perform_create(self, serializer):
        # El team debe ser validado en el serializer
        serializer.save()


class CabanaManagementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para gestionar una cabaña específica
    Solo miembros del equipo pueden editar/eliminar
    """
    serializer_class = CabanaManagementSerializer
    permission_classes = [IsAuthenticated, IsTeamMember]
    lookup_field = 'slug'

    def get_queryset(self):
        user_teams = Team.objects.filter(members__user=self.request.user)
        return Cabana.objects.filter(team__in=user_teams).select_related('team', 'ubicacion').prefetch_related('servicios', 'imagenes')


# ========================= RESEÑAS =========================

class ResenaListView(generics.ListAPIView):
    """
    Vista para listar reseñas de una cabaña específica
    """
    serializer_class = ResenaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        cabana_slug = self.kwargs['cabana_slug']
        cabana = get_object_or_404(Cabana, slug=cabana_slug, estado='disponible')
        return cabana.resenas.all().select_related('usuario__persona')


class ResenaCreateView(generics.CreateAPIView):
    """
    Vista para crear una reseña
    Solo usuarios autenticados que hayan rentado la cabaña
    """
    serializer_class = ResenaCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class ResenaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para gestionar una reseña específica
    Solo el autor puede editar/eliminar su reseña
    """
    serializer_class = ResenaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resena.objects.filter(usuario=self.request.user).select_related('cabana', 'usuario__persona')


# ========================= IMÁGENES =========================

class ImagenCabanaCreateView(generics.CreateAPIView):
    """
    Vista para subir imágenes a una cabaña
    Solo miembros del equipo pueden subir imágenes
    """
    serializer_class = ImagenCabanaCreateSerializer
    permission_classes = [IsAuthenticated]


class ImagenCabanaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para gestionar una imagen específica
    Solo miembros del equipo pueden editar/eliminar
    """
    serializer_class = ImagenCabanaCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo imágenes de cabañas donde el usuario es miembro del equipo
        user_teams = Team.objects.filter(members__user=self.request.user)
        return ImagenCabana.objects.filter(cabana__team__in=user_teams).select_related('cabana__team')

    def perform_update(self, serializer):
        # Si se marca como principal, desmarcar otras
        if serializer.validated_data.get('es_principal'):
            ImagenCabana.objects.filter(
                cabana=serializer.instance.cabana,
                es_principal=True
            ).exclude(id=serializer.instance.id).update(es_principal=False)
        serializer.save()


# ========================= DATOS DE APOYO =========================

class UbicacionListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear ubicaciones
    """
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['estado', 'ciudad']
    ordering = ['estado', 'ciudad']


class ServicioListView(generics.ListCreateAPIView):
    """
    Vista para listar y crear servicios
    """
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering = ['nombre']


# ========================= VISTAS PERSONALIZADAS =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_cabana_estado(request, slug):
    """
    Vista para cambiar el estado de una cabaña entre disponible e inactiva
    Solo para miembros del equipo
    """
    try:
        user_teams = Team.objects.filter(members__user=request.user)
        cabana = Cabana.objects.get(slug=slug, team__in=user_teams)
        
        # Toggle entre disponible e inactiva
        if cabana.estado == 'disponible':
            cabana.estado = 'inactiva'
        else:
            cabana.estado = 'disponible'
        
        cabana.save()
        
        serializer = CabanaManagementSerializer(cabana, context={'request': request})
        return Response(serializer.data)
        
    except Cabana.DoesNotExist:
        return Response(
            {'error': 'Cabaña no encontrada o sin permisos'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mis_cabanas_stats(request):
    """
    Vista para obtener estadísticas de las cabañas del usuario
    """
    user_teams = Team.objects.filter(members__user=request.user)
    cabanas = Cabana.objects.filter(team__in=user_teams)
    
    stats = {
        'total_cabanas': cabanas.count(),
        'disponibles': cabanas.filter(estado='disponible').count(),
        'inactivas': cabanas.filter(estado='inactiva').count(),
        'total_resenas': sum(cabana.resenas.count() for cabana in cabanas),
        'promedio_calificacion': 0,  # TODO: Calcular promedio real
    }
    
    return Response(stats)


@api_view(['GET'])
def cabanas_por_ubicacion(request):
    """
    Vista pública para obtener cabañas agrupadas por ubicación
    """
    ubicaciones = Ubicacion.objects.prefetch_related('cabanas').all()
    
    data = []
    for ubicacion in ubicaciones:
        cabanas_disponibles = ubicacion.cabanas.filter(estado='disponible')
        if cabanas_disponibles.exists():
            data.append({
                'ubicacion': UbicacionSerializer(ubicacion).data,
                'total_cabanas': cabanas_disponibles.count(),
                'precio_minimo': min(c.costo_por_noche for c in cabanas_disponibles),
                'precio_maximo': max(c.costo_por_noche for c in cabanas_disponibles),
            })
    
    return Response(data)