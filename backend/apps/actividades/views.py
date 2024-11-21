from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Actividad, Paquete, PaqueteCabana, PaqueteActividad
from .serializers import (
    ActividadSerializer, 
    PaqueteSerializer, 
    PaqueteCabanaSerializer, 
    PaqueteActividadSerializer
)
from django.db.models import Q


class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            arrendador = user.arrendador
            return Actividad.objects.filter(arrendador=arrendador)
        except:
            return Actividad.objects.none()

    @action(detail=False, methods=['GET'])
    def search(self, request):
        query = request.query_params.get('q', '')
        queryset = self.get_queryset().filter(
            Q(nombre__icontains=query) | Q(descripcion__icontains=query)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            arrendador = user.arrendador
            return Paquete.objects.filter(arrendador=arrendador)
        except:
            return Paquete.objects.none()

    @action(detail=False, methods=['GET'])
    def search(self, request):
        query = request.query_params.get('q', '')
        queryset = self.get_queryset().filter(
            Q(nombre__icontains=query)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def detalle_completo(self, request, pk=None):
        paquete = self.get_object()
        serializer = self.get_serializer(paquete)
        return Response(serializer.data)


class PaqueteCabanaViewSet(viewsets.ModelViewSet):
    queryset = PaqueteCabana.objects.all()
    serializer_class = PaqueteCabanaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            arrendador = user.arrendador
            return PaqueteCabana.objects.filter(paquete__arrendador=arrendador)
        except:
            return PaqueteCabana.objects.none()


class PaqueteActividadViewSet(viewsets.ModelViewSet):
    queryset = PaqueteActividad.objects.all()
    serializer_class = PaqueteActividadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            arrendador = user.arrendador
            return PaqueteActividad.objects.filter(paquete__arrendador=arrendador)
        except:
            return PaqueteActividad.objects.none()