from rest_framework import serializers
from .models import Actividad, Paquete, PaqueteCabana, PaqueteActividad
from apps.cabanas.models import Cabana
from apps.usuarios.models import Arrendador

class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ['id', 'arrendador', 'nombre', 'descripcion', 'costo']
        read_only_fields = ['id']


class PaqueteCabanaSerializer(serializers.ModelSerializer):
    cabana_nombre = serializers.CharField(source='cabana.nombre', read_only=True)

    class Meta:
        model = PaqueteCabana
        fields = ['id', 'paquete', 'cabana', 'cabana_nombre']
        read_only_fields = ['id']


class PaqueteActividadSerializer(serializers.ModelSerializer):
    actividad_nombre = serializers.CharField(source='actividad.nombre', read_only=True)

    class Meta:
        model = PaqueteActividad
        fields = ['id', 'paquete', 'actividad', 'actividad_nombre']
        read_only_fields = ['id']


class PaqueteSerializer(serializers.ModelSerializer):
    cabanas = serializers.SerializerMethodField()
    actividades = serializers.SerializerMethodField()

    class Meta:
        model = Paquete
        fields = ['id', 'arrendador', 'nombre', 'noches', 'precio_base', 'cabanas', 'actividades']
        read_only_fields = ['id']

    def get_cabanas(self, obj):
        paquete_cabanas = PaqueteCabana.objects.filter(paquete=obj)
        return PaqueteCabanaSerializer(paquete_cabanas, many=True).data

    def get_actividades(self, obj):
        paquete_actividades = PaqueteActividad.objects.filter(paquete=obj)
        return PaqueteActividadSerializer(paquete_actividades, many=True).data

    def create(self, validated_data):
        cabanas_data = self.context.get('view').request.data.get('cabanas', [])
        actividades_data = self.context.get('view').request.data.get('actividades', [])

        paquete = Paquete.objects.create(**validated_data)

        # Crear PaqueteCabana
        for cabana_id in cabanas_data:
            PaqueteCabana.objects.create(paquete=paquete, cabana_id=cabana_id)

        # Crear PaqueteActividad
        for actividad_id in actividades_data:
            PaqueteActividad.objects.create(paquete=paquete, actividad_id=actividad_id)

        return paquete

    def update(self, instance, validated_data):
        cabanas_data = self.context.get('view').request.data.get('cabanas', [])
        actividades_data = self.context.get('view').request.data.get('actividades', [])

        # Actualizar campos del paquete
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.noches = validated_data.get('noches', instance.noches)
        instance.precio_base = validated_data.get('precio_base', instance.precio_base)
        instance.save()

        # Eliminar PaqueteCabana existentes y crear nuevos
        PaqueteCabana.objects.filter(paquete=instance).delete()
        for cabana_id in cabanas_data:
            PaqueteCabana.objects.create(paquete=instance, cabana_id=cabana_id)

        # Eliminar PaqueteActividad existentes y crear nuevos
        PaqueteActividad.objects.filter(paquete=instance).delete()
        for actividad_id in actividades_data:
            PaqueteActividad.objects.create(paquete=instance, actividad_id=actividad_id)

        return instance