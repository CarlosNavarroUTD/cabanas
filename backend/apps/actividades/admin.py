from django.contrib import admin
from .models import Actividad, Paquete, PaqueteCabana, PaqueteActividad


class PaqueteCabanaInline(admin.TabularInline):
    model = PaqueteCabana
    extra = 1
    verbose_name = 'Cabaña'
    verbose_name_plural = 'Cabañas'


class PaqueteActividadInline(admin.TabularInline):
    model = PaqueteActividad
    extra = 1
    verbose_name = 'Actividad'
    verbose_name_plural = 'Actividades'


@admin.register(Actividad)
class ActividadAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'arrendador', 'costo']
    list_filter = ['arrendador']
    search_fields = ['nombre', 'descripcion']


@admin.register(Paquete)
class PaqueteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'arrendador', 'noches', 'precio_base']
    list_filter = ['arrendador']
    search_fields = ['nombre']
    inlines = [PaqueteCabanaInline, PaqueteActividadInline]


@admin.register(PaqueteCabana)
class PaqueteCabanaAdmin(admin.ModelAdmin):
    list_display = ['paquete', 'cabana']
    list_filter = ['paquete', 'cabana']


@admin.register(PaqueteActividad)
class PaqueteActividadAdmin(admin.ModelAdmin):
    list_display = ['paquete', 'actividad']
    list_filter = ['paquete', 'actividad']