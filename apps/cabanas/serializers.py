# apps/cabanas/serializers.py

from rest_framework import serializers
from django.db.models import Avg
from .models import Cabana, ImagenCabana, Resena, Ubicacion, Servicio
from apps.teams.models import Team
from apps.usuarios.models import Usuario


class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ['id', 'estado', 'ciudad', 'codigo_postal']


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'icono']


class ImagenCabanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenCabana
        fields = ['id', 'imagen', 'es_principal']


class ResenaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Resena
        fields = ['id', 'calificacion', 'comentario', 'fecha_creacion', 'usuario_nombre']
        read_only_fields = ['fecha_creacion', 'usuario_nombre']
    
    def get_usuario_nombre(self, obj):
        if hasattr(obj.usuario, 'persona'):
            return f"{obj.usuario.persona.nombre} {obj.usuario.persona.apellido}"
        return obj.usuario.nombre_usuario


class CabanaListSerializer(serializers.ModelSerializer):
    """Serializer para listar cabañas (vista pública para clientes)"""
    ubicacion = UbicacionSerializer(read_only=True)
    servicios = ServicioSerializer(many=True, read_only=True)
    imagen_principal = serializers.SerializerMethodField()
    calificacion_promedio = serializers.SerializerMethodField()
    total_resenas = serializers.SerializerMethodField()
    
    class Meta:
        model = Cabana
        fields = [
            'id', 'nombre', 'descripcion', 'slug', 'capacidad', 
            'costo_por_noche', 'ubicacion', 'servicios', 
            'imagen_principal', 'calificacion_promedio', 'total_resenas'
        ]
    
    def get_imagen_principal(self, obj):
        imagen_principal = obj.imagenes.filter(es_principal=True).first()
        if imagen_principal:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(imagen_principal.imagen.url)
        return None
    
    def get_calificacion_promedio(self, obj):
        promedio = obj.resenas.aggregate(Avg('calificacion'))['calificacion__avg']
        return round(promedio, 1) if promedio else 0
    
    def get_total_resenas(self, obj):
        return obj.resenas.count()


class CabanaDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle de cabaña (vista pública para clientes)"""
    ubicacion = UbicacionSerializer(read_only=True)
    servicios = ServicioSerializer(many=True, read_only=True)
    imagenes = ImagenCabanaSerializer(many=True, read_only=True)
    resenas = ResenaSerializer(many=True, read_only=True)
    calificacion_promedio = serializers.SerializerMethodField()
    total_resenas = serializers.SerializerMethodField()
    puede_resenar = serializers.SerializerMethodField()
    
    class Meta:
        model = Cabana
        fields = [
            'id', 'nombre', 'descripcion', 'slug', 'capacidad', 
            'costo_por_noche', 'ubicacion', 'servicios', 'imagenes',
            'resenas', 'calificacion_promedio', 'total_resenas', 
            'puede_resenar', 'creada_en', 'actualizada_en'
        ]
    
    def get_calificacion_promedio(self, obj):
        promedio = obj.resenas.aggregate(Avg('calificacion'))['calificacion__avg']
        return round(promedio, 1) if promedio else 0
    
    def get_total_resenas(self, obj):
        return obj.resenas.count()
    
    def get_puede_resenar(self, obj):
        """Determina si el usuario actual puede reseñar (debe haber rentado la cabaña)"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        # TODO: Implementar lógica para verificar si el usuario ha rentado la cabaña
        # Por ahora, verificamos si ya tiene una reseña
        return not obj.resenas.filter(usuario=request.user).exists()


class CabanaManagementSerializer(serializers.ModelSerializer):
    """Serializer para gestión de cabañas (solo para arrendadores del equipo)"""
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(),
        source='ubicacion',
        write_only=True
    )
    servicios_ids = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(),
        source='servicios',
        many=True,
        write_only=True,
        required=False
    )
    
    # Campos de solo lectura para la respuesta
    ubicacion = UbicacionSerializer(read_only=True)
    servicios = ServicioSerializer(many=True, read_only=True)
    imagenes = ImagenCabanaSerializer(many=True, read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Cabana
        fields = [
            'id', 'team', 'team_name', 'nombre', 'descripcion', 'slug',
            'capacidad', 'costo_por_noche', 'ubicacion', 'ubicacion_id',
            'estado', 'servicios', 'servicios_ids', 'imagenes',
            'creada_en', 'actualizada_en'
        ]
        read_only_fields = ['id', 'slug', 'creada_en', 'actualizada_en']
    
    def validate_team(self, value):
        """Valida que el usuario tenga permisos en el equipo"""
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Contexto de request requerido")
        
        user = request.user
        if not value.members.filter(user=user).exists():
            raise serializers.ValidationError("No tienes permisos para crear cabañas en este equipo")
        
        return value
    
    def create(self, validated_data):
        servicios = validated_data.pop('servicios', [])
        cabana = Cabana.objects.create(**validated_data)
        cabana.servicios.set(servicios)
        return cabana
    
    def update(self, instance, validated_data):
        servicios = validated_data.pop('servicios', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if servicios is not None:
            instance.servicios.set(servicios)
        
        return instance


class ResenaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar reseñas"""
    
    class Meta:
        model = Resena
        fields = ['cabana', 'calificacion', 'comentario']
    
    def validate_cabana(self, value):
        """Valida que el usuario pueda reseñar esta cabaña"""
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Contexto de request requerido")
        
        user = request.user
        
        # Verificar si ya tiene una reseña
        if value.resenas.filter(usuario=user).exists():
            raise serializers.ValidationError("Ya has reseñado esta cabaña")
        
        # TODO: Implementar validación de que el usuario haya rentado la cabaña
        # Por ahora permitimos cualquier reseña
        
        return value
    
    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class ImagenCabanaCreateSerializer(serializers.ModelSerializer):
    """Serializer para subir imágenes de cabañas"""
    
    class Meta:
        model = ImagenCabana
        fields = ['cabana', 'imagen', 'es_principal']
    
    def validate_cabana(self, value):
        """Valida que el usuario tenga permisos para subir imágenes a esta cabaña"""
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Contexto de request requerido")
        
        user = request.user
        if not value.team.members.filter(user=user).exists():
            raise serializers.ValidationError("No tienes permisos para gestionar esta cabaña")
        
        return value
    
    def validate_es_principal(self, value):
        """Si se marca como principal, desmarcar otras imágenes principales"""
        if value:
            cabana = self.initial_data.get('cabana')
            if cabana:
                # En el método create/update manejaremos esto
                pass
        return value
    
    def create(self, validated_data):
        if validated_data.get('es_principal'):
            # Desmarcar otras imágenes principales
            ImagenCabana.objects.filter(
                cabana=validated_data['cabana'],
                es_principal=True
            ).update(es_principal=False)
        
        return super().create(validated_data)