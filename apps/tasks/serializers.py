# serializers.py - VERSIÓN CORREGIDA PARA USUARIO PERSONALIZADO

from rest_framework import serializers
from .models import Task, TaskComment
from apps.teams.models import TeamMember
from apps.teams.serializers import UserSerializer
from django.contrib.auth import get_user_model
from django.conf import settings

# CORRECCIÓN 1: Usar el modelo de usuario personalizado
User = get_user_model()  # Esto obtiene 'usuarios.Usuario'

class TaskCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskComment
        fields = ('id', 'task', 'user', 'content', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

class TaskSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    
    # Campo separado para escritura de assigned_to
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'team', 'created_by', 
            'assigned_to', 'assigned_to_id', 'status', 'due_date', 
            'created_at', 'updated_at', 'comments'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at', 'comments', 'assigned_to')
    
    def validate_team(self, value):
        user = self.context['request'].user
        
        # Verificar si el usuario es miembro del equipo
        if not TeamMember.objects.filter(team=value, user=user).exists():
            raise serializers.ValidationError("No eres miembro de este equipo.")
        
        return value
    
    def validate_assigned_to_id(self, value):
        """Validar assigned_to_id usando el modelo de usuario personalizado"""
        if value is None:
            return value
            
        # Obtener el team del validated_data o de la instancia
        team_id = None
        if hasattr(self, 'initial_data'):
            team_id = self.initial_data.get('team')
        
        if not team_id and self.instance:
            team_id = self.instance.team.id
            
        if team_id and value:
            # CORRECCIÓN 2: Verificar que el usuario existe usando el modelo personalizado
            try:
                user = User.objects.get(id_usuario=value)  # Usar id_usuario en lugar de id
            except User.DoesNotExist:
                raise serializers.ValidationError("El usuario especificado no existe.")
            
            # Verificar si el usuario asignado es miembro del equipo
            if not TeamMember.objects.filter(team_id=team_id, user__id_usuario=value).exists():
                raise serializers.ValidationError("El usuario asignado no es miembro del equipo.")
        
        return value
    
    def create(self, validated_data):
        """Manejar assigned_to_id durante la creación con usuario personalizado"""
        # Extraer assigned_to_id y convertirlo a assigned_to
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        
        # Establecer el usuario creador
        validated_data['created_by'] = self.context['request'].user
        
        # CORRECCIÓN 3: Establecer el usuario asignado con modelo personalizado
        if assigned_to_id:
            try:
                assigned_user = User.objects.get(id_usuario=assigned_to_id)
                validated_data['assigned_to'] = assigned_user
            except User.DoesNotExist:
                raise serializers.ValidationError({"assigned_to_id": "El usuario especificado no existe."})
        
        return super().create(validated_data)
    
    def to_representation(self, instance):
        """Personalizar la representación de salida para el modelo de usuario personalizado"""
        data = super().to_representation(instance)
        
        # CORRECCIÓN 4: Ajustar la representación según tu modelo Usuario personalizado
        if instance.assigned_to:
            # Asumiendo que tu modelo Usuario tiene estos campos
            data['assigned_to'] = {
                'id_usuario': instance.assigned_to.id_usuario,
                'nombre_usuario': instance.assigned_to.nombre_usuario,
                'persona': {
                    'nombre': instance.assigned_to.persona.nombre if instance.assigned_to.persona else None,
                    'apellido': instance.assigned_to.persona.apellido if instance.assigned_to.persona else None,
                } if hasattr(instance.assigned_to, 'persona') and instance.assigned_to.persona else None
            }
        
        return data

class TaskUpdateSerializer(serializers.ModelSerializer):
    # Usar assigned_to_id también para actualizaciones
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = ('title', 'description', 'assigned_to_id', 'status', 'due_date')
    
    def validate_assigned_to_id(self, value):
        """Validar assigned_to_id para actualizaciones con usuario personalizado"""
        if value is None:
            return value
            
        task = self.instance
        
        # CORRECCIÓN 5: Verificar que el usuario existe usando el modelo personalizado
        try:
            user = User.objects.get(id_usuario=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("El usuario especificado no existe.")
        
        # Verificar si el usuario asignado es miembro del equipo
        if not TeamMember.objects.filter(team=task.team, user__id_usuario=value).exists():
            raise serializers.ValidationError("El usuario asignado no es miembro del equipo.")
        
        return value
    
    def update(self, instance, validated_data):
        """Manejar assigned_to_id durante la actualización con usuario personalizado"""
        # Extraer assigned_to_id y convertirlo a assigned_to
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        
        if assigned_to_id is not None:
            if assigned_to_id:
                try:
                    assigned_user = User.objects.get(id_usuario=assigned_to_id)
                    validated_data['assigned_to'] = assigned_user
                except User.DoesNotExist:
                    raise serializers.ValidationError({"assigned_to_id": "El usuario especificado no existe."})
            else:
                # Si assigned_to_id es None, desasignar la tarea
                validated_data['assigned_to'] = None
        
        return super().update(instance, validated_data)

class TaskStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Task.STATUS_CHOICES)

# ADICIONAL: Si necesitas verificar los campos de tu modelo Usuario personalizado
"""
Para verificar los campos exactos de tu modelo Usuario, puedes ejecutar en el shell de Django:

python manage.py shell

>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> print([field.name for field in User._meta.fields])

Esto te mostrará todos los campos disponibles en tu modelo Usuario personalizado.
Ajusta los nombres de los campos en el código anterior según lo que veas.
"""