from rest_framework import serializers
from .models import Cabana, Ubicacion, Servicio, ImagenCabana, Resena

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'icono']

class ImagenCabanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenCabana
        fields = ['id', 'imagen', 'es_principal']

class ResenaSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.SerializerMethodField()

    class Meta:
        model = Resena
        fields = ['id', 'usuario', 'nombre_usuario', 'calificacion', 
                  'comentario', 'fecha_creacion']
        read_only_fields = ['usuario']

    def get_nombre_usuario(self, obj):
        return f"{obj.usuario.first_name} {obj.usuario.last_name}"

class CabanaBaseSerializer(serializers.ModelSerializer):
    """
    Serializer base para Cabana con campos comunes
    """
    ubicacion = UbicacionSerializer(read_only=True)
    servicios = ServicioSerializer(many=True, read_only=True)

    class Meta:
        model = Cabana
        fields = [
            'id', 'arrendador', 'nombre', 'descripcion', 
            'capacidad', 'costo_por_noche', 'ubicacion', 'estado', 
            'servicios', 'creada_en', 'actualizada_en'
        ]
        read_only_fields = ['creada_en', 'actualizada_en']

class CabanaDetailSerializer(CabanaBaseSerializer):
    """
    Serializer detallado para Cabana
    """
    imagenes = ImagenCabanaSerializer(many=True, read_only=True)
    resenas = ResenaSerializer(many=True, read_only=True)

    class Meta(CabanaBaseSerializer.Meta):
        fields = CabanaBaseSerializer.Meta.fields + ['imagenes', 'resenas']

class CabanaListSerializer(serializers.ModelSerializer):
    """
    Serializer para listar Cabanas con información resumida
    """
    imagen_principal = serializers.SerializerMethodField()
    ubicacion_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Cabana
        fields = [
            'id', 'nombre', 'descripcion', 
            'capacidad', 'costo_por_noche', 'estado',
            'imagen_principal', 'ubicacion_nombre'
        ]

    def get_imagen_principal(self, obj):
        imagen_principal = obj.imagenes.filter(es_principal=True).first()
        return imagen_principal.imagen.url if imagen_principal else None

    def get_ubicacion_nombre(self, obj):
        return str(obj.ubicacion)

class CabanaCreateUpdateSerializer(CabanaBaseSerializer):
    """
    Serializer para crear y actualizar Cabanas
    """
    servicios = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(), 
        many=True, 
        required=False
    )
    imagenes = ImagenCabanaSerializer(many=True, read_only=True)
    
    class Meta(CabanaBaseSerializer.Meta):
        fields = CabanaBaseSerializer.Meta.fields + ['imagenes']
    
    def create(self, validated_data):
        servicios = validated_data.pop('servicios', [])
        cabana = Cabana.objects.create(**validated_data)
        cabana.servicios.set(servicios)
        return cabana
    
    def update(self, instance, validated_data):
        servicios = validated_data.pop('servicios', None)
        
        # Actualizar campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Actualizar servicios si se proporcionan
        if servicios is not None:
            instance.servicios.set(servicios)
        
        instance.save()
        return instance