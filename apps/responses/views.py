# backend/apps/responses/views.py
from rest_framework import viewsets, permissions
from .models import Respuesta, Tag
from .serializers import RespuestaSerializer, TagSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.usuario == request.user

class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.all()
    serializer_class = RespuestaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tags__nombre']
    search_fields = ['contenido']
    ordering_fields = ['fecha_creacion', 'order']  # Agregado 'order'

    def get_queryset(self):
        return Respuesta.objects.filter(usuario=self.request.user).order_by('order')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['nombre']