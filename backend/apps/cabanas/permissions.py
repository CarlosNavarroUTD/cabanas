# apps/cabanas/permissions.py
from rest_framework import permissions
from apps.cabanas.models import Arrendador

class IsArrendadorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Debug info
        print("User:", request.user.nombre_usuario)
        print("User type:", request.user.tipo_usuario)
        print("Has arrendador:", hasattr(request.user, 'arrendador'))
        print("Arrendador ID:", getattr(request.user, 'arrendador_id', None))
        print("Dir user:", dir(request.user))  # Esto mostrará todos los atributos disponibles
        print("Method:", request.method)

        
        # Allow read methods for all
        if request.method in permissions.SAFE_METHODS:
            return True
        
        try:
            # Seguir la cadena de relaciones
            arrendador = request.user.persona.arrendador
            print("Arrendador encontrado:", arrendador)
            return True
        except (AttributeError, Arrendador.DoesNotExist):
            print("Error al obtener arrendador:", 
                  hasattr(request.user, 'persona'),
                  hasattr(request.user.persona if hasattr(request.user, 'persona') else None, 'arrendador'))
            return False

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        try:
            return obj.arrendador == request.user.persona.arrendador
        except AttributeError:
            return False