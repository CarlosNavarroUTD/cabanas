from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Cabana, Ubicacion, Servicio, Resena
from .serializers import (
    CabanaListSerializer, 
    CabanaDetailSerializer, 
    CabanaCreateUpdateSerializer,
    UbicacionSerializer, 
    ServicioSerializer, 
    ResenaSerializer
)
from .permissions import IsArrendadorOrReadOnly


class CabanaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Cabanas
    """
    queryset = Cabana.objects.select_related('ubicacion')\
        .prefetch_related('servicios', 'imagenes')\
        .order_by('id')  # Ordena por el campo 'creada_en' u otro campo relevante
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    permission_classes = [IsAuthenticated, IsArrendadorOrReadOnly]

    # Configuración de filtros y búsqueda
    filterset_fields = ['ubicacion__id', 'capacidad', 'estado']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['costo_por_noche', 'creada_en']

    def get_serializer_class(self):
        """
        Selecciona el serializador según la acción
        """
        if self.action in ['create', 'update', 'partial_update']:
            return CabanaCreateUpdateSerializer
        elif self.action == 'list':
            return CabanaListSerializer
        return CabanaDetailSerializer

    def perform_create(self, serializer):
        """
        Asigna el arrendador actual como propietario de la cabaña
        """
        arrendador = self.request.user.arrendador
        if not arrendador:
            raise serializers.ValidationError("El usuario no es un arrendador válido.")
        serializer.save(arrendador=arrendador)


    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def agregar_resena(self, request, pk=None):
        """
        Acción personalizada para agregar una reseña a una cabaña
        """
        cabana = self.get_object()
        serializer = ResenaSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                cabana=cabana,
                usuario=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['GET'])
    def resenas(self, request, pk=None):
        """
        Acción para obtener todas las reseñas de una cabaña
        """
        cabana = self.get_object()
        resenas = Resena.objects.filter(cabana=cabana)
        serializer = ResenaSerializer(resenas, many=True)
        return Response(serializer.data)

class UbicacionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Ubicaciones
    """
    queryset = Ubicacion.objects.all()  # Ordena por el campo 'id' o cualquier campo relevante
    serializer_class = UbicacionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']

class ServicioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Servicios
    """
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']

class ResenaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de Reseñas
    """
    queryset = Resena.objects.select_related('usuario', 'cabana')
    serializer_class = ResenaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['fecha_creacion', 'calificacion']

    def get_queryset(self):
        """
        Personaliza el queryset para mostrar solo reseñas relevantes
        """
        user = self.request.user
        # Si es arrendador, muestra reseñas de sus cabañas
        if hasattr(user, 'arrendador'):
            return Resena.objects.filter(cabana__arrendador=user.arrendador)
        # Si es usuario normal, muestra sus propias reseñas
        return Resena.objects.filter(usuario=user)

    def perform_create(self, serializer):
        """
        Asigna el usuario actual como autor de la reseña
        """
        serializer.save(usuario=self.request.user)