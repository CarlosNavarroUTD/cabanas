from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Tienda

@api_view(['GET'])
@permission_classes([AllowAny])
def store_public_view(request, slug):
    """
    Vista pública para mostrar información de la tienda.
    No requiere autenticación.
    """
    try:
        store = get_object_or_404(Tienda, slug=slug, activa=True)
    except Http404:
        return Response(
            {'error': 'Tienda no encontrada o inactiva'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Datos públicos de la tienda
    store_data = {
        'nombre': store.nombre,
        'slug': store.slug,
        'plantilla': store.plantilla,
        'logo': store.logo.url if store.logo else None,
        'color_primario': store.color_primario,
        'color_secundario': store.color_secundario,
        'fuente': store.fuente,
        'configuracion_extra': store.configuracion_extra,
        'dominio_personalizado': store.dominio_personalizado,
    }
    
    return Response(store_data)

@api_view(['GET'])
@permission_classes([AllowAny])
def store_subdomain_view(request):
    """
    Vista para manejar requests desde subdominios.
    Utiliza el middleware para obtener la tienda.
    """
    # Corregir el atributo: debería ser 'store' no 'Tienda'
    if hasattr(request, 'store') and getattr(request, 'is_store_subdomain', False):
        store = request.store
        
        # Verificar que la tienda esté activa
        if not store.activa:
            return Response(
                {'error': 'Tienda no disponible'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        store_data = {
            'nombre': store.nombre,
            'slug': store.slug,
            'plantilla': store.plantilla,
            'logo': store.logo.url if store.logo else None,
            'color_primario': store.color_primario,
            'color_secundario': store.color_secundario,
            'fuente': store.fuente,
            'configuracion_extra': store.configuracion_extra,
            'dominio_personalizado': store.dominio_personalizado,
        }
        
        return Response(store_data)
    
    return Response(
        {'error': 'Tienda no encontrada'}, 
        status=status.HTTP_404_NOT_FOUND
    )