from rest_framework import serializers
from django.db import transaction
from .models import Node, NodePermission, TeamNodePermission


class NodePermissionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = NodePermission
        fields = ['id', 'user', 'username', 'permission', 'created_at']
        read_only_fields = ['created_at']


class TeamPermissionSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = TeamNodePermission
        fields = ['id', 'team', 'team_name', 'permission', 'created_at']
        read_only_fields = ['created_at']


class NodeSerializer(serializers.ModelSerializer):
    children_count = serializers.SerializerMethodField()
    shared_with = serializers.SerializerMethodField()
    
    class Meta:
        model = Node
        fields = [
            'id', 'parent', 'type', 'title', 'content', 
            'order', 'is_completed', 'created_at', 'updated_at',
            'children_count', 'shared_with'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_children_count(self, obj):
        return obj.children.count()
    
    def get_shared_with(self, obj):
        return obj.permissions.count() + obj.team_permissions.count()
    
    def validate(self, data):
        # Validar que is_completed solo se use con type='todo'
        node_type = data.get('type', self.instance.type if self.instance else None)
        is_completed = data.get('is_completed')
        
        if is_completed is not None and node_type != 'todo' and is_completed:
            raise serializers.ValidationError(
                {"is_completed": "Solo los nodos de tipo 'todo' pueden estar completados"}
            )
        
        # Validar que el padre pertenezca al mismo usuario
        parent = data.get('parent')
        request = self.context.get('request')
        
        if parent:
            if parent.owner != request.user:
                raise serializers.ValidationError(
                    {"parent": "El nodo padre debe pertenecer al mismo usuario"}
                )
        
        return data


class NodeDetailSerializer(NodeSerializer):
    """Serializer extendido para mostrar detalles completos de un nodo"""
    permissions = NodePermissionSerializer(many=True, read_only=True, source='permissions.all')
    team_permissions = TeamPermissionSerializer(many=True, read_only=True, source='team_permissions.all')
    
    class Meta:
        model = Node
        fields = NodeSerializer.Meta.fields + ['permissions', 'team_permissions']
        read_only_fields = NodeSerializer.Meta.read_only_fields


class NodeMoveSerializer(serializers.Serializer):
    """Serializer para mover nodos (cambiar padre y/o orden)"""
    parent_id = serializers.IntegerField(allow_null=True, required=False)
    order = serializers.IntegerField(required=False)
    
    def validate_parent_id(self, value):
        if value is not None:
            try:
                parent = Node.objects.get(pk=value)
                # Verificar que pertenezca al mismo usuario
                if parent.owner != self.context['request'].user:
                    raise serializers.ValidationError("El nodo padre debe pertenecer al mismo usuario")
                # Verificar que no se intente hacer un ciclo (padre como hijo de sí mismo)
                node = self.context.get('node')
                if node:
                    # Verificar que no se esté intentando mover un nodo a uno de sus descendientes
                    descendants = node.get_descendants() if hasattr(node, 'get_descendants') else []
                    if parent.id in [desc.id for desc in descendants]:
                        raise serializers.ValidationError("No se puede mover un nodo a uno de sus descendientes")
            except Node.DoesNotExist:
                raise serializers.ValidationError("El nodo padre no existe")
        return value


class ShareNodeSerializer(serializers.Serializer):
    """Serializer para compartir un nodo con usuarios"""
    user_id = serializers.IntegerField(required=False)
    team_id = serializers.IntegerField(required=False)
    permission = serializers.ChoiceField(choices=Node.PERMISSION_TYPES)
    
    def validate(self, data):
        # Verificar que se proporcione al menos un usuario o equipo
        if 'user_id' not in data and 'team_id' not in data:
            raise serializers.ValidationError(
                "Debe proporcionar al menos un user_id o team_id"
            )
        return data


class BatchUpdateNodesSerializer(serializers.Serializer):
    """Serializer para actualizar múltiples nodos a la vez"""
    nodes = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
            allow_empty=False
        ),
        allow_empty=False
    )
    
    def validate_nodes(self, value):
        request = self.context['request']
        for node_data in value:
            if 'id' not in node_data:
                raise serializers.ValidationError("Cada nodo debe tener un ID")
            
            try:
                node = Node.objects.get(id=node_data['id'])
                # Verificar que el usuario tenga permiso para editar este nodo
                if node.owner != request.user and not node.permissions.filter(
                        user=request.user, 
                        permission__in=['edit', 'admin']
                    ).exists():
                    raise serializers.ValidationError(f"No tienes permiso para editar el nodo {node.id}")
            except Node.DoesNotExist:
                raise serializers.ValidationError(f"El nodo con ID {node_data['id']} no existe")
        
        return value
    
    @transaction.atomic
    def update(self, instance, validated_data):
        nodes_data = validated_data['nodes']
        updated_nodes = []
        
        for node_data in nodes_data:
            node_id = node_data.pop('id')
            node = Node.objects.get(id=node_id)
            
            # Actualizar solo los campos proporcionados
            for key, value in node_data.items():
                setattr(node, key, value)
            
            node.save()
            updated_nodes.append(node)
        
        return updated_nodes