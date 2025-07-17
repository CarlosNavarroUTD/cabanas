from django.http import Http404
from django.shortcuts import get_object_or_404
from apps.tiendas.models import Store

class SubdomainMiddleware:
    """
    Middleware para manejar subdominios y redirigir a la tienda correspondiente
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Obtener el host completo
        host = request.get_host().lower()
        
        # Verificar si es un subdominio
        parts = host.split('.')
        
        # Si tiene más de 2 partes, podría ser un subdominio
        if len(parts) >= 3:
            subdomain = parts[0]
            
            # Evitar procesar subdominios del sistema (www, api, admin)
            system_subdomains = ['www', 'api', 'admin', 'mail', 'ftp']
            
            if subdomain not in system_subdomains:
                try:
                    # Buscar la tienda por slug
                    store = Store.objects.get(slug=subdomain)
                    
                    # Añadir la tienda al request para uso posterior
                    request.store = store
                    request.is_store_subdomain = True
                    
                except Store.DoesNotExist:
                    # Si no existe la tienda, continuar normalmente
                    # O podrías lanzar un 404 personalizado
                    pass
        
        # Continuar con el request normal
        response = self.get_response(request)
        return response