from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Producto, ProductoRopa, ProductoElectronica
from .serializers import ProductoSerializer
from apps.tiendas.models import Tienda
from apps.teams.models import TeamMember

class IsTeamMemberForProductStore(permissions.BasePermission):
    """
    Permiso para verificar si el usuario es miembro del equipo al que pertenece la tienda del producto
    """
    def has_object_permission(self, request, view, obj):
        # Permitir al propietario de la tienda
        if obj.sitio.propietario == request.user:
            return True
        
        # Verificar si el usuario es miembro de algún equipo asociado a la tienda
        user_teams = request.user.teams.filter(role__in=['ADMIN', 'MEMBER']).values_list('team', flat=True)
        store_teams = obj.sitio.teams.all().values_list('id', flat=True)
        
        # Si hay intersección entre los equipos del usuario y los de la tienda
        if set(user_teams).intersection(set(store_teams)):
            # Solo lectura para miembros, escritura solo para admins o propietario
            if request.method in permissions.SAFE_METHODS:
                return True
            # Para operaciones de escritura, verificar si es admin del equipo
            return request.user.teams.filter(
                team__in=store_teams, 
                role='ADMIN'
            ).exists()
            
        return False

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberForProductStore]
    
    def get_queryset(self):
        """
        Filtrar productos de tiendas a las que el usuario tiene acceso
        """
        user = self.request.user
        
        # Obtener equipos donde el usuario es miembro
        user_teams = user.teams.filter(role__in=['ADMIN', 'MEMBER']).values_list('team', flat=True)
        
        # Filtrar productos de tiendas propias y de equipos donde es miembro
        return Producto.objects.filter(
            Q(sitio__propietario=user) | Q(sitio__teams__in=user_teams)
        ).distinct()
    
    def perform_create(self, serializer):
        # Verificar que el usuario tenga acceso a la tienda
        store_id = self.request.data.get('sitio')
        if store_id:
            try:
                store = Tienda.objects.get(id=store_id)
                user = self.request.user
                
                # Verificar si el usuario es propietario
                if store.propietario == user:
                    serializer.save()
                    return
                
                # Verificar si el usuario es miembro de algún equipo asociado a la tienda
                user_teams = user.teams.filter(role__in=['ADMIN', 'MEMBER']).values_list('team', flat=True)
                store_teams = store.teams.all().values_list('id', flat=True)
                
                if set(user_teams).intersection(set(store_teams)):
                    # Verificar si es admin para crear productos
                    if user.teams.filter(team__in=store_teams, role='ADMIN').exists():
                        serializer.save()
                        return
                    else:
                        raise permissions.PermissionDenied("Solo los administradores del equipo pueden crear productos.")
                else:
                    raise permissions.PermissionDenied("No tienes permiso para crear productos en esta tienda.")
                    
            except Tienda.DoesNotExist:
                raise permissions.PermissionDenied("La tienda especificada no existe.")
        else:
            raise permissions.PermissionDenied("Debes especificar una tienda.")
    
    @action(detail=False, methods=['get'], url_path='by-store/(?P<store_id>\\d+)')
    def by_store(self, request, store_id=None):
        """Obtener todos los productos de una tienda"""
        try:
            store = Tienda.objects.get(id=store_id)
        except Tienda.DoesNotExist:
            return Response(
                {"detail": "La tienda no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar permiso
        user = request.user
        has_access = False
        
        # Es propietario
        if store.propietario == user:
            has_access = True
        else:
            # Es miembro de algún equipo asociado a la tienda
            user_teams = user.teams.filter(role__in=['ADMIN', 'MEMBER']).values_list('team', flat=True)
            store_teams = store.teams.all().values_list('id', flat=True)
            has_access = bool(set(user_teams).intersection(set(store_teams)))
        
        if not has_access:
            return Response(
                {"detail": "No tienes permiso para ver productos de esta tienda."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        productos = Producto.objects.filter(sitio=store)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-type/(?P<product_type>[^/.]+)')
    def by_type(self, request, product_type=None):
        """Obtener productos por tipo"""
        valid_types = [choice[0] for choice in Producto._meta.get_field('tipo').choices]
        
        if product_type not in valid_types:
            return Response(
                {"detail": f"Tipo de producto inválido. Opciones: {', '.join(valid_types)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Filtrar por tipo y permisos del usuario
        queryset = self.get_queryset().filter(tipo=product_type)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='my-products')
    def my_products(self, request):
        """Obtener todos los productos del usuario (de sus tiendas y equipos)"""
        products = self.get_queryset()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)