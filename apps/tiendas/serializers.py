from rest_framework import serializers
from .models import Tienda
from apps.usuarios.serializers import UsuarioSerializer
from apps.teams.serializers import TeamSerializer

class StoreSerializer(serializers.ModelSerializer):
    propietario_details = UsuarioSerializer(source='propietario', read_only=True)
    teams_details = TeamSerializer(source='teams', many=True, read_only=True)
    subdomain_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Tienda
        fields = [
            'id', 'nombre', 'slug', 'plantilla', 'dominio_personalizado', 
            'logo', 'color_primario', 'color_secundario', 'fuente', 
            'configuracion_extra', 'activa', 'creado_en', 'actualizado_en',
            'propietario', 'propietario_details', 'teams', 'teams_details',
            'subdomain_url'
        ]
        read_only_fields = ['creado_en', 'actualizado_en', 'propietario']
    
    def validate_slug(self, value):
        """Validar que el slug sea único y válido"""
        if self.instance and self.instance.slug == value:
            return value
            
        if Tienda.objects.filter(slug=value).exists():
            raise serializers.ValidationError("Este slug ya está en uso.")
        
        # Lista de slugs reservados
        reserved_slugs = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog']
        if value.lower() in reserved_slugs:
            raise serializers.ValidationError("Este slug está reservado.")
        
        return value
    
    def validate_dominio_personalizado(self, value):
        """Validar dominio personalizado"""
        if not value:
            return value
            
        import re
        domain_pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$'
        
        if not re.match(domain_pattern, value):
            raise serializers.ValidationError("Formato de dominio inválido.")
        
        return value
    
    def get_subdomain_url(self, obj):
        """Genera la URL del subdominio"""
        return obj.get_absolute_url()

