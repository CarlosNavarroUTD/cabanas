# productos/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import Producto, ProductoRopa, ProductoElectronica

class ProductoRopaInline(admin.StackedInline):
    model = ProductoRopa
    extra = 0
    verbose_name = "Información de Ropa"
    verbose_name_plural = "Información de Ropa"
    
    def has_add_permission(self, request, obj=None):
        return obj and obj.tipo == 'ropa'
    
    def has_change_permission(self, request, obj=None):
        return obj and obj.tipo == 'ropa'

class ProductoElectronicaInline(admin.StackedInline):
    model = ProductoElectronica
    extra = 0
    verbose_name = "Información de Electrónica"
    verbose_name_plural = "Información de Electrónica"
    
    def has_add_permission(self, request, obj=None):
        return obj and obj.tipo == 'electronica'
    
    def has_change_permission(self, request, obj=None):
        return obj and obj.tipo == 'electronica'

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'nombre',
        'show_store_info',
        'tipo',
        'precio',
        'show_tipo_specific_info',
        'creado_en'
    )
    
    list_filter = (
        'tipo',
        'creado_en',
        'sitio__plantilla',
        ('precio', admin.SimpleListFilter),
    )
    
    search_fields = (
        'nombre',
        'descripcion',
        'sitio__nombre',
        'sitio__slug',
        'sitio__propietario__email',
        'sitio__propietario__nombre_usuario'
    )
    
    readonly_fields = (
        'creado_en',
        'show_store_details',
        'show_tipo_details'
    )
    
    # Organización de campos
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion', 'precio', 'tipo')
        }),
        ('Tienda', {
            'fields': ('sitio', 'show_store_details')
        }),
        ('Información Específica del Tipo', {
            'fields': ('show_tipo_details',),
            'classes': ('collapse',)
        }),
        ('Información del Sistema', {
            'fields': ('creado_en',),
            'classes': ('collapse',)
        }),
    )
    
    # Incluir inlines para información específica
    inlines = [ProductoRopaInline, ProductoElectronicaInline]
    
    # Acciones personalizadas
    actions = ['duplicate_product', 'apply_discount', 'change_store']
    
    # Filtros personalizados
    class PriceRangeFilter(admin.SimpleListFilter):
        title = 'rango de precio'
        parameter_name = 'price_range'
        
        def lookups(self, request, model_admin):
            return (
                ('0-50', '$0 - $50'),
                ('50-100', '$50 - $100'),
                ('100-500', '$100 - $500'),
                ('500+', '$500+'),
            )
        
        def queryset(self, request, queryset):
            if self.value() == '0-50':
                return queryset.filter(precio__gte=0, precio__lte=50)
            elif self.value() == '50-100':
                return queryset.filter(precio__gte=50, precio__lte=100)
            elif self.value() == '100-500':
                return queryset.filter(precio__gte=100, precio__lte=500)
            elif self.value() == '500+':
                return queryset.filter(precio__gte=500)
    
    def get_queryset(self, request):
        """Optimizar consultas con select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related(
            'sitio', 
            'sitio__propietario'
        ).prefetch_related(
            'sitio__teams'
        )
    
    def show_store_info(self, obj):
        """Mostrar información de la tienda con enlace"""
        try:
            url = reverse('admin:tiendas_tiendas_change', args=[obj.sitio.pk])
            return format_html(
                '<a href="{}">{}</a><br>'
                '<small>Propietario: {}</small>',
                url,
                obj.sitio.nombre,
                obj.sitio.propietario.nombre_usuario
            )
        except:
            return obj.sitio.nombre
    show_store_info.short_description = 'Tienda'
    show_store_info.admin_order_field = 'sitio__nombre'
    
    def show_store_details(self, obj):
        """Mostrar detalles completos de la tienda"""
        if obj.sitio:
            try:
                url = reverse('admin:tiendas_tiendas_change', args=[obj.sitio.pk])
                teams_count = obj.sitio.teams.count()
                products_count = obj.sitio.productos.count()
                
                return format_html(
                    '<strong>Tienda:</strong> <a href="{}">{}</a><br>'
                    '<strong>Slug:</strong> {}<br>'
                    '<strong>Propietario:</strong> {}<br>'
                    '<strong>Plantilla:</strong> {}<br>'
                    '<strong>Equipos:</strong> {}<br>'
                    '<strong>Total Productos:</strong> {}',
                    url, obj.sitio.nombre,
                    obj.sitio.slug,
                    obj.sitio.propietario.nombre_usuario,
                    obj.sitio.get_plantilla_display(),
                    teams_count,
                    products_count
                )
            except:
                return f"Tienda: {obj.sitio.nombre}"
        return "Sin tienda asignada"
    show_store_details.short_description = 'Detalles de la Tienda'
    
    def show_tipo_specific_info(self, obj):
        """Mostrar información específica según el tipo de producto"""
        try:
            if obj.tipo == 'ropa' and hasattr(obj, 'ropa'):
                return format_html(
                    '<strong>Talla:</strong> {}<br>'
                    '<strong>Género:</strong> {}<br>'
                    '<strong>Material:</strong> {}',
                    obj.ropa.talla,
                    obj.ropa.genero,
                    obj.ropa.material
                )
            elif obj.tipo == 'electronica' and hasattr(obj, 'electronica'):
                return format_html(
                    '<strong>Marca:</strong> {}<br>'
                    '<strong>Modelo:</strong> {}<br>'
                    '<strong>Garantía:</strong> {} meses',
                    obj.electronica.marca,
                    obj.electronica.modelo,
                    obj.electronica.garantia_meses
                )
            else:
                return f"Producto tipo: {obj.get_tipo_display()}"
        except:
            return "Sin información específica"
    show_tipo_specific_info.short_description = 'Info Específica'
    
    def show_tipo_details(self, obj):
        """Mostrar detalles del tipo en el formulario"""
        if not obj.pk:
            return "Guarda el producto primero para ver detalles específicos del tipo"
        
        try:
            if obj.tipo == 'ropa' and hasattr(obj, 'ropa'):
                return format_html(
                    '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">'
                    '<h4>Información de Ropa</h4>'
                    '<p><strong>Talla:</strong> {}</p>'
                    '<p><strong>Género:</strong> {}</p>'
                    '<p><strong>Material:</strong> {}</p>'
                    '</div>',
                    obj.ropa.talla,
                    obj.ropa.genero,
                    obj.ropa.material
                )
            elif obj.tipo == 'electronica' and hasattr(obj, 'electronica'):
                return format_html(
                    '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">'
                    '<h4>Información de Electrónica</h4>'
                    '<p><strong>Marca:</strong> {}</p>'
                    '<p><strong>Modelo:</strong> {}</p>'
                    '<p><strong>Garantía:</strong> {} meses</p>'
                    '</div>',
                    obj.electronica.marca,
                    obj.electronica.modelo,
                    obj.electronica.garantia_meses
                )
            else:
                return format_html(
                    '<div style="background: #fff3cd; padding: 10px; border-radius: 5px;">'
                    '<p>Este producto es de tipo <strong>{}</strong> pero no tiene información específica asociada.</p>'
                    '<p>Para agregar información específica, edita el producto después de guardarlo.</p>'
                    '</div>',
                    obj.get_tipo_display()
                )
        except Exception as e:
            return f"Error al mostrar detalles: {str(e)}"
    show_tipo_details.short_description = 'Detalles del Tipo de Producto'
    
    # Acciones personalizadas
    def duplicate_product(self, request, queryset):
        """Duplicar productos seleccionados"""
        for product in queryset:
            # Duplicar producto base
            original_pk = product.pk
            product.pk = None
            product.nombre = f"{product.nombre} (Copia)"
            product.save()
            
            # Duplicar información específica si existe
            try:
                if product.tipo == 'ropa':
                    original_ropa = ProductoRopa.objects.get(producto_id=original_pk)
                    ProductoRopa.objects.create(
                        producto=product,
                        talla=original_ropa.talla,
                        genero=original_ropa.genero,
                        material=original_ropa.material
                    )
                elif product.tipo == 'electronica':
                    original_electronica = ProductoElectronica.objects.get(producto_id=original_pk)
                    ProductoElectronica.objects.create(
                        producto=product,
                        marca=original_electronica.marca,
                        modelo=original_electronica.modelo,
                        garantia_meses=original_electronica.garantia_meses
                    )
            except:
                pass  # Si no existe información específica, continuar
        
        self.message_user(request, f"Se duplicaron {queryset.count()} productos.")
    duplicate_product.short_description = "Duplicar productos seleccionados"
    
    def apply_discount(self, request, queryset):
        """Aplicar descuento del 10% a productos seleccionados"""
        from decimal import Decimal
        for product in queryset:
            product.precio = product.precio * Decimal('0.9')
            product.save()
        self.message_user(request, f"Se aplicó 10% de descuento a {queryset.count()} productos.")
    apply_discount.short_description = "Aplicar 10% de descuento"

@admin.register(ProductoRopa)
class ProductoRopaAdmin(admin.ModelAdmin):
    list_display = ('get_producto_nombre', 'talla', 'genero', 'material')
    list_filter = ('genero', 'talla')
    search_fields = ('producto__nombre', 'material', 'talla')
    
    def get_producto_nombre(self, obj):
        return obj.producto.nombre
    get_producto_nombre.short_description = 'Producto'
    get_producto_nombre.admin_order_field = 'producto__nombre'

@admin.register(ProductoElectronica)
class ProductoElectronicaAdmin(admin.ModelAdmin):
    list_display = ('get_producto_nombre', 'marca', 'modelo', 'garantia_meses')
    list_filter = ('marca', 'garantia_meses')
    search_fields = ('producto__nombre', 'marca', 'modelo')
    
    def get_producto_nombre(self, obj):
        return obj.producto.nombre
    get_producto_nombre.short_description = 'Producto'
    get_producto_nombre.admin_order_field = 'producto__nombre'