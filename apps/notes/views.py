from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Node, NodePermission, TeamNodePermission
from .serializers import (
    NodeSerializer, 
    NodeDetailSerializer, 
    NodeMoveSerializer, 
    ShareNodeSerializer,
    BatchUpdateNodesSerializer
)
from .permissions import IsNodeOwnerOrHasPermission


class NodeViewSet(viewsets.ModelViewSet):
    serializer_class = NodeSerializer
    permission_classes = [permissions.IsAuthenticated, IsNodeOwnerOrHasPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'order', 'title']
    ordering = ['order', 'created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Mostrar todos los nodos propios o compartidos con el usuario
        return Node.objects.filter(
            Q(owner=user) | 
            Q(permissions__user=user) |
            Q(team_permissions__team__members=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'share_info']:
            return NodeDetailSerializer
        elif self.action == 'move':
            return NodeMoveSerializer
        elif self.action == 'share':
            return ShareNodeSerializer
        elif self.action == 'batch_update':
            return BatchUpdateNodesSerializer
        return NodeSerializer
    
    def perform_create(self, serializer):
        # Si se está creando como hijo de otro nodo, calcular orden automático
        parent_id = self.request.data.get('parent')
        order = self.request.data.get('order')
        
        if parent_id and not order:
            # Si no se proporciona orden, poner al final
            try:
                parent = Node.objects.get(pk=parent_id)
                max_order = parent.children.count()
                serializer.save(owner=self.request.user, order=max_order)
                return
            except Node.DoesNotExist:
                pass
        
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        """Obtener todos los hijos directos de un nodo"""
        parent = self.get_object()
        children = parent.children.all().order_by('order')
        page = self.paginate_queryset(children)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(children, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """Mover un nodo cambiando su padre y/o orden"""
        node = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'node': node, 'request': request})
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            # Actualizar padre si se proporciona
            if 'parent_id' in serializer.validated_data:
                parent_id = serializer.validated_data['parent_id']
                if parent_id is None:
                    node.parent = None
                else:
                    node.parent = Node.objects.get(pk=parent_id)
            
            # Actualizar orden si se proporciona
            if 'order' in serializer.validated_data:
                node.order = serializer.validated_data['order']
            
            node.save()
            
            # Opcional: reordenar los hermanos si es necesario
            if node.parent and 'order' in serializer.validated_data:
                siblings = node.parent.children.exclude(pk=node.pk).order_by('order')
                current_order = 0
                
                for sibling in siblings:
                    if current_order == node.order:
                        current_order += 1
                    sibling.order = current_order
                    sibling.save(update_fields=['order'])
                    current_order += 1
        
        return Response(NodeSerializer(node).data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Compartir nodo con un usuario o equipo"""
        node = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            user_id = serializer.validated_data.get('user_id')
            team_id = serializer.validated_data.get('team_id')
            permission = serializer.validated_data.get('permission')
            
            result = {"status": "shared", "details": []}
            
            if user_id:
                # Crear o actualizar permiso de usuario
                user_permission, created = NodePermission.objects.update_or_create(
                    node=node,
                    user_id=user_id,
                    defaults={'permission': permission}
                )
                result["details"].append({
                    "type": "user",
                    "id": user_id,
                    "permission": permission,
                    "created": created
                })
            
            if team_id:
                # Crear o actualizar permiso de equipo
                team_permission, created = TeamNodePermission.objects.update_or_create(
                    node=node,
                    team_id=team_id,
                    defaults={'permission': permission}
                )
                result["details"].append({
                    "type": "team",
                    "id": team_id,
                    "permission": permission,
                    "created": created
                })
        
        return Response(result)
    
    @action(detail=True, methods=['get'])
    def share_info(self, request, pk=None):
        """Obtener información de los permisos de un nodo"""
        node = self.get_object()
        serializer = NodeDetailSerializer(node, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def batch_update(self, request):
        """Actualizar múltiples nodos a la vez (útil para drag and drop)"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            updated_nodes = serializer.update(None, serializer.validated_data)
        
        # Devolver los nodos actualizados
        response_serializer = NodeSerializer(updated_nodes, many=True)
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_complete(self, request, pk=None):
        """Marcar/desmarcar un nodo todo como completado"""
        node = self.get_object()
        
        if node.type != 'todo':
            return Response(
                {"detail": "Solo los nodos de tipo 'todo' pueden marcarse como completados"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        node.is_completed = not node.is_completed
        node.save(update_fields=['is_completed'])
        
        serializer = self.get_serializer(node)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def root_nodes(self, request):
        """Obtener todos los nodos raíz (sin padre)"""
        user = request.user
        nodes = self.get_queryset().filter(parent=None)
        
        page = self.paginate_queryset(nodes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(nodes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Búsqueda avanzada de nodos"""
        query = request.query_params.get('q', '')
        node_type = request.query_params.get('type')
        
        queryset = self.get_queryset().filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )
        
        if node_type:
            queryset = queryset.filter(type=node_type)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)