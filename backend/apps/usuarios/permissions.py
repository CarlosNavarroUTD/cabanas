# apps/usuarios/permissions.py
from rest_framework import permissions

class EsAdministrador(permissions.BasePermission):
    """
    Permite acceso solo a usuarios administradores.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario == 'admin'

class EsArrendador(permissions.BasePermission):
    """
    Permite acceso solo a usuarios arrendadores.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario == 'arrendador'

class EsCliente(permissions.BasePermission):
    """
    Permite acceso solo a usuarios clientes.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario == 'cliente'

class PropietarioOAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        # Log de depuración para permisos
        print(f"Permission Check - User: {request.user}")
        print(f"User Authenticated: {request.user.is_authenticated}")
        print(f"User Type: {request.user.tipo_usuario}")
        
        if not request.user.is_authenticated:
            return False
        
        # Si es administrador, tiene acceso total
        if request.user.tipo_usuario == 'admin':
            return True
        
        return True  # Permitir por defecto para verificar en has_object_permission

    def has_object_permission(self, request, view, obj):
        # Log de depuración para permisos de objeto
        print(f"Object Permission Check")
        print(f"Request User: {request.user}")
        print(f"Object User: {obj}")
        print(f"User Type: {request.user.tipo_usuario}")
        
        if not request.user.is_authenticated:
            return False
            
        # Si es administrador, tiene acceso total
        if request.user.tipo_usuario == 'admin':
            return True
            
        # Para otros usuarios, verificar si son propietarios del recurso
        if hasattr(obj, 'id_usuario'):
            result = obj.id_usuario == request.user.id_usuario
            print(f"Checking id_usuario - Result: {result}")
            return result
        elif hasattr(obj, 'usuario'):
            result = obj.usuario == request.user
            print(f"Checking usuario - Result: {result}")
            return result
        
        return False

class ArrendadorPermission(permissions.BasePermission):
    """
    Permisos específicos para arrendadores.
    """
    SAFE_METHODS = ['GET', 'HEAD', 'POST', 'OPTIONS']
    ARRENDADOR_METHODS = ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH']
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.tipo_usuario == 'admin':
            return True

        if request.user.tipo_usuario == 'arrendador':
            return request.method in self.ARRENDADOR_METHODS

        if request.method in self.SAFE_METHODS:
            return True

        return False

class ClientePermission(permissions.BasePermission):
    """
    Permisos específicos para clientes.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Administradores tienen acceso total
        if request.user.tipo_usuario == 'admin':
            return True

        # Clientes pueden ver y modificar sus propios datos
        if request.user.tipo_usuario == 'cliente':
            if request.method in ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH']:
                return True
            return False

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.tipo_usuario == 'admin':
            return True

        # Verificar si el cliente es dueño del recurso
        if request.user.tipo_usuario == 'cliente':
            if hasattr(obj, 'id_cliente'):
                return obj.id_cliente.id_persona.id_usuario == request.user
            elif hasattr(obj, 'id_usuario'):
                return obj.id_usuario == request.user
        return False

class PersonaPermission(permissions.BasePermission):
    """
    Permisos específicos para el manejo de personas.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Administradores tienen acceso total
        if request.user.tipo_usuario == 'admin':
            return True

        # Usuarios autenticados pueden ver sus propios datos
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Solo administradores pueden crear nuevas personas
        if request.method == 'POST':
            return request.user.tipo_usuario == 'admin'

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.tipo_usuario == 'admin':
            return True

        # Usuarios solo pueden ver/modificar sus propios datos
        return obj.id_usuario == request.user

class RegistroPermission(permissions.BasePermission):
    """
    Permisos para el registro de usuarios.
    """
    def has_permission(self, request, view):
        # Permitir registro sin autenticación
        if request.method == 'POST':
            return True
        # Para otras operaciones, requerir autenticación
        return request.user and request.user.is_authenticated


