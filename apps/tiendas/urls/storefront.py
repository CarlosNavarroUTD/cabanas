#backend/apps/tiendas/urls/storefront.py

from django.urls import path
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from apps.tiendas.models import Store

def get_store_data(request, slug):
    """
    Vista para obtener datos de la tienda basado en el slug del subdominio.
    Proporciona la configuración de la tienda al frontend.
    """
    store = get_object_or_404(Store, slug=slug)
    
    # Crear un objeto con los datos necesarios para el frontend
    store_data = {
        'id': store.id,
        'nombre': store.nombre,
        'plantilla': store.plantilla,
        'logo': store.logo.url if store.logo else None,
        'color_primario': store.color_primario,
        'color_secundario': store.color_secundario,
        'fuente': store.fuente,
        'configuracion_extra': store.configuracion_extra,
    }
    
    return JsonResponse(store_data)

def get_store_products(request, slug):
    """
    Vista para obtener productos de la tienda basado en el slug del subdominio.
    """
    store = get_object_or_404(Store, slug=slug)
    
    # Obtener productos básicos de la tienda
    products = store.productos.all().values(
        'id', 'nombre', 'descripcion', 'precio', 'tipo'
    )
    
    return JsonResponse({'products': list(products)})

urlpatterns = [
    path('api/store-config/', get_store_data, name='store_config'),
    path('api/products/', get_store_products, name='store_products'),
    # Otras rutas específicas para la tienda
]