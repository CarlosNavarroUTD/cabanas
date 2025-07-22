# apps/cabanas/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Cabana, Servicio, ImagenCabana, Resena
from .serializers import (
    CabanaListSerializer, CabanaDetailSerializer, CabanaCreateUpdateSerializer,
    ServicioSerializer, ImagenCabanaSerializer, ImagenCabanaCreateSerializer,
    ResenaSerializer, ResenaCreateSerializer
)
from apps.teams.models import TeamMember

from apps.cabanas import serializers


class ServicioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para servicios - Solo lectura para todos los usuarios
    """
    queryset = Servicio.objects.filter(activo=True)
    serializer_class = ServicioSerializer
    permission_classes = [permissions.AllowAny]


class CabanaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para cabañas con diferentes permisos según la acción
    """
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['estado', 'capacidad', 'permite_mascotas', 'team']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['costo_por_noche', 'capacidad', 'creada_en', 'calificacion_promedio']
    ordering = ['-creada_en']

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            # Para listar y ver detalles, solo cabañas disponibles
            return Cabana.objects.filter(estado='disponible').prefetch_related(
                'servicios', 'imagenes', 'resenas__usuario__persona', 'team'
            )
        else:
            # Para crear, actualizar, eliminar - todas las cabañas del usuario
            user = self.request.user
            if user.is_authenticated:
                # Obtener cabañas de los equipos donde el usuario es miembro
                team_ids = TeamMember.objects.filter(user=user).values_list('team_id', flat=True)
                return Cabana.objects.filter(team_id__in=team_ids).prefetch_related(
                    'servicios', 'imagenes', 'resenas__usuario__persona', 'team'
                )
            return Cabana.objects.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return CabanaListSerializer
        elif self.action == 'retrieve':
            return CabanaDetailSerializer
        else:
            return CabanaCreateUpdateSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Cualquiera puede ver las cabañas disponibles
            permission_classes = [permissions.AllowAny]
        else:
            # Solo usuarios autenticados pueden crear/editar
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Crear cabaña asignándola a un equipo del usuario"""
        # Obtener el team_id del request
        team_id = self.request.data.get('team_id')
        if not team_id:
            raise serializers.ValidationError({"team_id": "Este campo es requerido."})
        
        # Verificar que el usuario pertenezca al equipo
        team_member = TeamMember.objects.filter(
            user=self.request.user,
            team_id=team_id
        ).first()
        
        if not team_member:
            raise serializers.ValidationError({"team_id": "No tienes permisos para crear cabañas en este equipo."})
        
        serializer.save(team_id=team_id)

    def perform_update(self, serializer):
        """Verificar permisos antes de actualizar"""
        cabana = self.get_object()
        
        # Verificar que el usuario pertenezca al equipo de la cabaña
        team_member = TeamMember.objects.filter(
            user=self.request.user,
            team=cabana.team
        ).first()
        
        if not team_member:
            raise PermissionDenied("No tienes permisos para editar esta cabaña.")
        
        serializer.save()
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # 🚨 AQUI usamos un serializer de salida
        output_serializer = CabanaListSerializer(serializer.instance, context=self.get_serializer_context())
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # 🚨 También usamos serializer de salida
        output_serializer = CabanaListSerializer(serializer.instance, context=self.get_serializer_context())
        return Response(output_serializer.data)


    def perform_destroy(self, instance):
        """Verificar permisos antes de eliminar"""
        # Verificar que el usuario pertenezca al equipo de la cabaña
        team_member = TeamMember.objects.filter(
            user=self.request.user,
            team=instance.team
        ).first()
        
        if not team_member:
            raise PermissionDenied("No tienes permisos para eliminar esta cabaña.")
        
        instance.delete()

    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """Endpoint para consultar disponibilidad de una cabaña"""
        cabana = self.get_object()
        
        # Aquí puedes integrar con tu sistema de reservas
        # Por ahora retornamos un ejemplo básico
        return Response({
            'cabana_id': cabana.id,
            'nombre': cabana.nombre,
            'estado': cabana.estado,
            'disponible': cabana.estado == 'disponible',
            'mensaje': 'Cabaña disponible para reservas' if cabana.estado == 'disponible' else 'Cabaña no disponible'
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def agregar_imagen(self, request, pk=None):
        """Agregar imágenes a una cabaña"""
        cabana = self.get_object()
        
        # Verificar permisos
        team_member = TeamMember.objects.filter(
            user=request.user,
            team=cabana.team
        ).first()
        
        if not team_member:
            return Response(
                {"detail": "No tienes permisos para agregar imágenes a esta cabaña."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ImagenCabanaCreateSerializer(
            data=request.data,
            context={'request': request, 'cabana': cabana}
        )
        
        if serializer.is_valid():
            serializer.save(cabana=cabana)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def agregar_resena(self, request, pk=None):
        """Agregar reseña a una cabaña"""
        cabana = self.get_object()
        
        # TODO: Verificar que el usuario haya rentado la cabaña
        # Aquí deberías integrar con tu sistema de reservas/rentas
        # Por ahora permitimos que cualquier usuario autenticado reseñe
        
        serializer = ResenaCreateSerializer(
            data=request.data,
            context={'request': request, 'cabana': cabana}
        )
        
        if serializer.is_valid():
            serializer.save(usuario=request.user, cabana=cabana)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def mis_cabanas(self, request):
        """Obtener cabañas del usuario autenticado"""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Se requiere autenticación."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Obtener cabañas de los equipos donde el usuario es miembro
        team_ids = TeamMember.objects.filter(user=request.user).values_list('team_id', flat=True)
        cabanas = Cabana.objects.filter(team_id__in=team_ids).prefetch_related(
            'servicios', 'imagenes', 'team'
        )
        
        serializer = CabanaListSerializer(cabanas, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='team/(?P<team_id>[^/.]+)')
    def cabanas_por_equipo(self, request, team_id=None):
        """
        Obtener cabañas de un equipo específico (por ID del equipo)
        - Solo muestra cabañas disponibles si el usuario no está autenticado
        - Si el usuario pertenece al equipo, puede ver todas
        """
        if request.user.is_authenticated:
            # Verificar si el usuario pertenece al equipo
            es_miembro = TeamMember.objects.filter(user=request.user, team_id=team_id).exists()
            if es_miembro:
                cabanas = Cabana.objects.filter(team_id=team_id).prefetch_related('servicios', 'imagenes', 'team')
            else:
                # Si no es miembro, mostrar solo las disponibles
                cabanas = Cabana.objects.filter(team_id=team_id, estado='disponible').prefetch_related('servicios', 'imagenes', 'team')
        else:
            # Usuario no autenticado: solo cabañas disponibles
            cabanas = Cabana.objects.filter(team_id=team_id, estado='disponible').prefetch_related('servicios', 'imagenes', 'team')

        serializer = CabanaListSerializer(cabanas, many=True, context={'request': request})
        return Response(serializer.data)



class ImagenCabanaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar imágenes de cabañas
    """
    serializer_class = ImagenCabanaSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        # Solo imágenes de cabañas donde el usuario es miembro del equipo
        user = self.request.user
        team_ids = TeamMember.objects.filter(user=user).values_list('team_id', flat=True)
        return ImagenCabana.objects.filter(cabana__team_id__in=team_ids)

    def perform_create(self, serializer):
        """Verificar permisos antes de crear imagen"""
        cabana_id = self.request.data.get('cabana_id')
        if not cabana_id:
            raise serializers.ValidationError({"cabana_id": "Este campo es requerido."})
        
        cabana = get_object_or_404(Cabana, id=cabana_id)
        
        # Verificar permisos
        team_member = TeamMember.objects.filter(
            user=self.request.user,
            team=cabana.team
        ).first()
        
        if not team_member:
            raise PermissionDenied("No tienes permisos para agregar imágenes a esta cabaña.")
        
        serializer.save(cabana=cabana)

    def perform_update(self, serializer):
        """Verificar permisos antes de actualizar"""
        imagen = self.get_object()
        
        team_member = TeamMember.objects.filter(
            user=self.request.user,
            team=imagen.cabana.team
        ).first()
        
        if not team_member:
            raise PermissionDenied("No tienes permisos para editar esta imagen.")
        
        serializer.save()

    def perform_destroy(self, instance):
        """Verificar permisos antes de eliminar"""
        team_member = TeamMember.objects.filter(
            user=self.request.user,
            team=instance.cabana.team
        ).first()
        
        if not team_member:
            raise PermissionDenied("No tienes permisos para eliminar esta imagen.")
        
        instance.delete()


class ResenaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar reseñas
    """
    serializer_class = ResenaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            # Cualquiera puede ver todas las reseñas
            return Resena.objects.all().select_related('usuario__persona', 'cabana')
        else:
            # Solo las reseñas del usuario autenticado para editar/eliminar
            return Resena.objects.filter(usuario=self.request.user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Crear reseña verificando que no exista una previa"""
        cabana_id = self.request.data.get('cabana_id')
        if not cabana_id:
            raise serializers.ValidationError({"cabana_id": "Este campo es requerido."})
        
        cabana = get_object_or_404(Cabana, id=cabana_id)
        
        # Verificar que no haya reseñado antes
        if Resena.objects.filter(usuario=self.request.user, cabana=cabana).exists():
            raise serializers.ValidationError({"detail": "Ya has reseñado esta cabaña."})
        
        # TODO: Verificar que el usuario haya rentado la cabaña
        # Integrar con sistema de reservas/rentas
        
        serializer.save(usuario=self.request.user, cabana=cabana)

    def perform_update(self, serializer):
        """Solo el autor puede actualizar su reseña"""
        resena = self.get_object()
        if resena.usuario != self.request.user:
            raise PermissionDenied("Solo puedes editar tus propias reseñas.")
        serializer.save()

    def perform_destroy(self, instance):
        """Solo el autor puede eliminar su reseña"""
        if instance.usuario != self.request.user:
            raise PermissionDenied("Solo puedes eliminar tus propias reseñas.")
        instance.delete()