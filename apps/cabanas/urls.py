# apps/cabanas/urls.py

from django.urls import path
from . import views

app_name = 'cabanas'

urlpatterns = [
    # ========================= RUTAS PÚBLICAS (CLIENTES) =========================
    
    # Listar cabañas disponibles
    path('', views.CabanaListView.as_view(), name='cabana-list'),
    
    # Detalle de cabaña pública
    path('<slug:slug>/', views.CabanaDetailView.as_view(), name='cabana-detail'),
    
    # Cabañas por ubicación (vista pública)
    path('ubicaciones/stats/', views.cabanas_por_ubicacion, name='cabanas-por-ubicacion'),
    
    # ========================= RESEÑAS =========================
    
    # Listar reseñas de una cabaña
    path('<slug:cabana_slug>/resenas/', views.ResenaListView.as_view(), name='resena-list'),
    
    # Crear reseña
    path('resenas/crear/', views.ResenaCreateView.as_view(), name='resena-create'),
    
    # Gestionar reseña específica
    path('resenas/<int:pk>/', views.ResenaDetailView.as_view(), name='resena-detail'),
    
    # ========================= GESTIÓN DE CABAÑAS (ARRENDADORES) =========================
    
    # Gestionar cabañas del usuario
    path('gestion/', views.CabanaManagementListView.as_view(), name='cabana-management-list'),
    
    # Gestionar cabaña específica
    path('gestion/<slug:slug>/', views.CabanaManagementDetailView.as_view(), name='cabana-management-detail'),
    
    # Toggle estado de cabaña
    path('gestion/<slug:slug>/toggle-estado/', views.toggle_cabana_estado, name='toggle-cabana-estado'),
    
    # Estadísticas de mis cabañas
    path('gestion/stats/', views.mis_cabanas_stats, name='mis-cabanas-stats'),
    
    # ========================= IMÁGENES =========================
    
    # Subir imagen a cabaña
    path('imagenes/crear/', views.ImagenCabanaCreateView.as_view(), name='imagen-create'),
    
    # Gestionar imagen específica
    path('imagenes/<int:pk>/', views.ImagenCabanaDetailView.as_view(), name='imagen-detail'),
    
    # ========================= DATOS DE APOYO =========================
    
    # Ubicaciones
    path('ubicaciones/', views.UbicacionListView.as_view(), name='ubicacion-list'),
    
    # Servicios
    path('servicios/', views.ServicioListView.as_view(), name='servicio-list'),
]