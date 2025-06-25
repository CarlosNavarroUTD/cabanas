from rest_framework import permissions
from django.db.models import Q


class IsNodeOwnerOrHasPermission(permissions.BasePermission):
    """
    Permite acceso solo si el usuario:
    1. Es el propietario del nodo
    2. Tiene permisos específicos sobre el nodo
    3. Es miembro de un equipo que tiene permisos sobre el nodo
    """
    
    def has_permission(self, request, view):
        # Para listados y creación, solo necesitamos verificar que el usuario esté autenticado
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # El propietario siempre tiene acceso completo
        if obj.owner == user:
            return True
        
        # Verificar permisos compartidos
        if request.method in permissions.SAFE_METHODS:
            # Para operaciones de lectura, verificar permiso 'read', 'edit' o 'admin'
            return (
                obj.permissions.filter(user=user).exists() or 
                obj.team_permissions.filter(team__members=user).exists()
            )
        else:
            # Para operaciones de escritura, verificar permiso 'edit' o 'admin'
            return (
                obj.permissions.filter(user=user, permission__in=['edit', 'admin']).exists() or
                obj.team_permissions.filter(team__members=user, permission__in=['edit', 'admin']).exists()
            )


class IsAdminForNode(permissions.BasePermission):
    """
    Restringe acciones como compartir o eliminar a:
    1. El propietario del nodo
    2. Usuarios con permiso 'admin'
    """
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # El propietario siempre tiene acceso admin
        if obj.owner == user:
            return True
        
        # Verificar permiso admin específico
        return (
            obj.permissions.filter(user=user, permission='admin').exists() or
            obj.team_permissions.filter(team__members=user, permission='admin').exists()
        )