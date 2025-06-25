# tiendas/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Tienda

@admin.register(Tienda)
class TiendasAdmin(admin.ModelAdmin):
    list_display = (
        'nombre', 
        'slug', 
        'propietario_info', 
        'plantilla', 
        'show_teams_count',
        'show_products_count',
        'dominio_personalizado', 
        'show_logo_preview',
        'creado_en'
    )
    list_filter = (
        'plantilla', 
        'creado_en',
        ('dominio_personalizado', admin.EmptyFieldListFilter),
        ('logo', admin.EmptyFieldListFilter),
    )
    search_fields = (
        'nombre', 
        'slug', 
        'propietario__email',
        'propietario__nombre_usuario', 
        'dominio_personalizado'
    )
    
    # Autocompletar el slug a partir del nombre
    prepopulated_fields = {'slug': ('nombre',)}
    
    readonly_fields = (
        'creado_en', 
        'show_logo_full_preview', 
        'show_subdomain_url',
        'show_teams_info',
        'show_products_info'
    )
    
    # Organización de campos en el formulario
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'slug', 'propietario')
        }),
        ('Configuración Visual', {
            'fields': (
                'plantilla', 
                'logo', 
                'show_logo_full_preview',
                'color_primario', 
                'color_secundario', 
                'fuente'
            )
        }),
        ('Dominio y URL', {
            'fields': ('dominio_personalizado', 'show_subdomain_url'),
            'classes': ('collapse',)
        }),
        ('Configuración Avanzada', {
            'fields': ('configuracion_extra',),
            'classes': ('collapse',)
        }),
        ('Equipos y Productos', {
            'fields': ('teams', 'show_teams_info', 'show_products_info'),
            'classes': ('collapse',)
        }),
        ('Información del Sistema', {
            'fields': ('creado_en',),
            'classes': ('collapse',)
        }),
    )
    
    # Campos para formulario de adición
    add_fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'slug', 'propietario')
        }),
        ('Configuración Visual', {
            'fields': ('plantilla', 'logo', 'color_primario', 'color_secundario', 'fuente')
        }),
    )
    
    # Filtros personalizados
    filter_horizontal = ('teams',)
    
    # Acciones personalizadas
    actions = ['duplicate_store', 'reset_colors']
    
    def propietario_info(self, obj):
        """Mostrar información del propietario con enlace"""
        url = reverse('admin:usuarios_usuario_change', args=[obj.propietario.pk])
        try:
            nombre_completo = f"{obj.propietario.persona.nombre} {obj.propietario.persona.apellido}"
            return format_html(
                '<a href="{}">{}</a><br><small>{}</small>',
                url,
                nombre_completo,
                obj.propietario.email
            )
        except:
            return format_html(
                '<a href="{}">{}</a><br><small>{}</small>',
                url,
                obj.propietario.nombre_usuario,
                obj.propietario.email
            )
    propietario_info.short_description = 'Propietario'
    propietario_info.admin_order_field = 'propietario__nombre_usuario'
    
    def show_teams_count(self, obj):
        """Mostrar número de equipos asociados"""
        count = obj.teams.count()
        if count > 0:
            url = reverse('admin:teams_team_changelist') + f'?stores__id__exact={obj.id}'
            return format_html('<a href="{}">{} equipos</a>', url, count)
        return "Sin equipos"
    show_teams_count.short_description = 'Equipos'
    
    def show_products_count(self, obj):
        """Mostrar número de productos"""
        count = obj.productos.count()
        if count > 0:
            # Asumiendo que el admin de productos existe
            try:
                url = reverse('admin:productos_producto_changelist') + f'?sitio__id__exact={obj.id}'
                return format_html('<a href="{}">{} productos</a>', url, count)
            except:
                return f"{count} productos"
        return "Sin productos"
    show_products_count.short_description = 'Productos'
    
    def show_logo_preview(self, obj):
        """Mostrar preview pequeño del logo en la lista"""
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-height: 30px; max-width: 50px;">',
                obj.logo.url
            )
        return "Sin logo"
    show_logo_preview.short_description = 'Logo'
    
    def show_logo_full_preview(self, obj):
        """Mostrar preview completo del logo en el formulario"""
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 300px; border: 1px solid #ddd; padding: 10px;">',
                obj.logo.url
            )
        return "No hay logo cargado"
    show_logo_full_preview.short_description = 'Preview del Logo'
    
    def show_subdomain_url(self, obj):
        """Mostrar URL del subdominio"""
        from django.conf import settings
        base_domain = getattr(settings, 'STORE_BASE_DOMAIN', 'example.com')
        subdomain_url = f"https://{obj.slug}.{base_domain}"
        
        if obj.dominio_personalizado:
            custom_url = f"https://{obj.dominio_personalizado}"
            return format_html(
                'Subdominio: <a href="{}" target="_blank">{}</a><br>'
                'Dominio personalizado: <a href="{}" target="_blank">{}</a>',
                subdomain_url, subdomain_url,
                custom_url, custom_url
            )
        else:
            return format_html(
                'Subdominio: <a href="{}" target="_blank">{}</a>',
                subdomain_url, subdomain_url
            )
    show_subdomain_url.short_description = 'URLs de la Tienda'
    
    def show_teams_info(self, obj):
        """Mostrar información detallada de equipos"""
        teams = obj.teams.all()
        if teams:
            team_list = []
            for team in teams:
                url = reverse('admin:teams_team_change', args=[team.pk])
                member_count = team.members.count()
                team_list.append(
                    f'<a href="{url}">{team.name}</a> ({member_count} miembros)'
                )
            return format_html('<br>'.join(team_list))
        return "No hay equipos asociados"
    show_teams_info.short_description = 'Equipos Asociados'
    
    def show_products_info(self, obj):
        """Mostrar información básica de productos"""
        productos = obj.productos.all()[:5]  # Solo los primeros 5
        total = obj.productos.count()
        
        if productos:
            product_list = []
            for producto in productos:
                try:
                    url = reverse('admin:productos_producto_change', args=[producto.pk])
                    product_list.append(f'<a href="{url}">{producto.nombre}</a>')
                except:
                    product_list.append(producto.nombre)
            
            result = '<br>'.join(product_list)
            if total > 5:
                result += f'<br><small>... y {total - 5} más</small>'
            return format_html(result)
        return "No hay productos"
    show_products_info.short_description = 'Productos Recientes'
    
    # Acciones personalizadas
    def duplicate_store(self, request, queryset):
        """Duplicar tiendas seleccionadas"""
        for store in queryset:
            store.pk = None
            store.slug = f"{store.slug}-copy"
            store.nombre = f"{store.nombre} (Copia)"
            store.save()
        self.message_user(request, f"Se duplicaron {queryset.count()} tiendas.")
    duplicate_store.short_description = "Duplicar tiendas seleccionadas"
    
    def reset_colors(self, request, queryset):
        """Resetear colores a valores por defecto"""
        queryset.update(
            color_primario='#3498db',
            color_secundario='#2ecc71'
        )
        self.message_user(request, f"Se resetearon los colores de {queryset.count()} tiendas.")
    reset_colors.short_description = "Resetear colores por defecto"