# apps/cabanas/serializers.py

from rest_framework import serializers
from .models import Cabana, Servicio, ImagenCabana, Resena
from apps.usuarios.serializers import PersonaSerializer
from apps.teams.serializers import TeamSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'icono', 'descripcion', 'activo']

class ImagenCabanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenCabana
        fields = ['id', 'imagen', 'es_principal', 'descripcion', 'orden', 'creada_en']
        read_only_fields = ['creada_en']

class ResenaSerializer(serializers.ModelSerializer):
    usuario_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Resena
        fields = ['id', 'calificacion', 'comentario', 'fecha_creacion', 'fecha_actualizacion', 'usuario', 'usuario_info']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'usuario']
    
    def get_usuario_info(self, obj):
        if hasattr(obj.usuario, 'persona'):
            return {
                'nombre': obj.usuario.persona.nombre,
                'apellido': obj.usuario.persona.apellido,
                'nombre_usuario': obj.usuario.nombre_usuario
            }
        return {
            'nombre_usuario': obj.usuario.nombre_usuario
        }

class CabanaListSerializer(serializers.ModelSerializer):
    """Serializer para listado de cabañas (información básica)"""
    servicios = ServicioSerializer(many=True, read_only=True)
    imagen_principal = serializers.SerializerMethodField()
    calificacion_promedio = serializers.ReadOnlyField()
    total_resenas = serializers.ReadOnlyField()
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Cabana
        fields = [
            'id', 'slug', 'nombre', 'descripcion', 'capacidad', 
            'costo_por_noche', 'estado', 'servicios', 'superficie',
            'numero_habitaciones', 'numero_banos', 'permite_mascotas',
            'imagen_principal', 'calificacion_promedio', 'total_resenas',
            'team_name', 'creada_en'
        ]
        read_only_fields = ['slug', 'creada_en', 'calificacion_promedio', 'total_resenas']
    
    def get_imagen_principal(self, obj):
        imagen = obj.imagen_principal
        if imagen and imagen.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(imagen.imagen.url)
        return None

class CabanaDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle completo de cabaña"""
    servicios = ServicioSerializer(many=True, read_only=True)
    imagenes = ImagenCabanaSerializer(many=True, read_only=True)
    resenas = ResenaSerializer(many=True, read_only=True)
    calificacion_promedio = serializers.ReadOnlyField()
    total_resenas = serializers.ReadOnlyField()
    team = TeamSerializer(read_only=True)
    
    class Meta:
        model = Cabana
        fields = [
            'id', 'slug', 'nombre', 'descripcion', 'capacidad',
            'costo_por_noche', 'estado', 'servicios', 'superficie',
            'numero_habitaciones', 'numero_banos', 'permite_mascotas',
            'reglas_casa', 'hora_checkin', 'hora_checkout',
            'imagenes', 'resenas', 'calificacion_promedio', 'total_resenas',
            'team', 'creada_en', 'actualizada_en'
        ]
        read_only_fields = ['slug', 'creada_en', 'actualizada_en', 'calificacion_promedio', 'total_resenas']

class CabanaCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar cabañas"""
    servicios = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.filter(activo=True),
        many=True,
        required=False
    )
    
    class Meta:
        model = Cabana
        fields = [
            'nombre', 'descripcion', 'capacidad', 'costo_por_noche',
            'estado', 'servicios', 'superficie', 'numero_habitaciones',
            'numero_banos', 'permite_mascotas', 'reglas_casa',
            'hora_checkin', 'hora_checkout'
        ]
    
    def validate_capacidad(self, value):
        if value < 1:
            raise serializers.ValidationError("La capacidad debe ser al menos 1 persona.")
        return value
    
    def validate_costo_por_noche(self, value):
        if value <= 0:
            raise serializers.ValidationError("El costo por noche debe ser mayor a 0.")
        return value
    
    def validate_superficie(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("La superficie debe ser mayor a 0.")
        return value

class ImagenCabanaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenCabana
        fields = ['imagen', 'es_principal', 'descripcion', 'orden']
    
    def validate(self, data):
        # Si se marca como principal, verificar que no haya otra imagen principal
        if data.get('es_principal', False):
            cabana = self.context.get('cabana')
            if cabana and cabana.imagenes.filter(es_principal=True).exists():
                # Si ya existe una imagen principal, esta nueva será principal y la otra no
                cabana.imagenes.filter(es_principal=True).update(es_principal=False)
        return data

class ResenaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = ['calificacion', 'comentario']
    
    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value
    
    def validate(self, data):
        # Verificar que el usuario no haya reseñado ya esta cabaña
        request = self.context.get('request')
        cabana = self.context.get('cabana')
        
        if request and cabana:
            if Resena.objects.filter(usuario=request.user, cabana=cabana).exists():
                raise serializers.ValidationError("Ya has reseñado esta cabaña.")
        
        return data