from rest_framework import serializers
from .models import Team, TeamMember, Invitation
from django.contrib.auth import get_user_model
from apps.usuarios.serializers import PersonaSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id_usuario', 'nombre_usuario', 'email', 'phone', 'persona')
        read_only_fields = ('id_usuario',)

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'description', 'created_at')
        read_only_fields = ('created_at',)

class TeamMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TeamMember
        fields = ('id', 'team', 'user', 'role', 'joined_at')
        read_only_fields = ('id', 'joined_at')

class InvitationSerializer(serializers.ModelSerializer):
    # Utiliza TeamSerializer para obtener todos los detalles del equipo
    team = TeamSerializer(read_only=True)
    
    # Añade información sobre el creador de la invitación
    created_by = UserSerializer(read_only=True)
    
    # Campo adicional para permitir enviar solo el ID al crear/actualizar
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(),
        source='team',
        write_only=True
    )
    
    class Meta:
        model = Invitation
        fields = ('id', 'team', 'team_id', 'email', 'phone', 'status', 'created_at', 'created_by')
        read_only_fields = ('id', 'created_at', 'status')
    
    def validate(self, data):
        if not data.get('email') and not data.get('phone'):
            raise serializers.ValidationError("Se requiere email o teléfono.")
        
        if data.get('email') and data.get('phone'):
            raise serializers.ValidationError("Debe proporcionar solo email o teléfono, no ambos.")
            
        return data

class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False, max_length=20)
    
    def validate(self, data):
        if not data.get('email') and not data.get('phone'):
            raise serializers.ValidationError("Se requiere email o teléfono.")
        
        if data.get('email') and data.get('phone'):
            raise serializers.ValidationError("Debe proporcionar solo email o teléfono, no ambos.")
            
        return data