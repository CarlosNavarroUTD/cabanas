# apps/cabanas/permissions.py
from rest_framework import permissions

class IsArrendadorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read methods for all
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For write methods, check if the user has an arrendador
        # If not, create one automatically or raise a specific error
        return hasattr(request.user, 'arrendador')

    def has_object_permission(self, request, view, obj):
        # Allow read methods
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For write methods, ensure the object belongs to the current user's arrendador
        return obj.arrendador == request.user.arrendador