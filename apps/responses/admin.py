# apps/responses/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import Respuesta, Tag, RespuestaTag

class RespuestaTagInline(admin.TabularInline):
    model = RespuestaTag
    extra = 1
    autocomplete_fields = ['tag']

@admin.register(Respuesta)
class RespuestaAdmin(admin.ModelAdmin):
    list_display = ('contenido_truncado', 'fecha_creacion', 'usuario', 'get_tags')
    search_fields = ('contenido', 'usuario__email', 'usuario__nombre_usuario', 'respuestatag__tag__nombre')
    list_filter = ('fecha_creacion', 'respuestatag__tag')
    inlines = [RespuestaTagInline]
    
    def contenido_truncado(self, obj):
        return obj.contenido[:150] + '...' if len(obj.contenido) > 150 else obj.contenido
    contenido_truncado.short_description = 'Contenido'
    
    def get_tags(self, obj):
        tags = obj.respuestatag_set.select_related('tag').all()
        return format_html(
            ', '.join(f'<span class="tag-badge">{t.tag.nombre}</span>' 
                     for t in tags)
        )
    get_tags.short_description = 'Tags'
    get_tags.allow_tags = True

class RespuestasInline(admin.TabularInline):
    model = RespuestaTag
    extra = 0
    verbose_name = "Respuesta"
    verbose_name_plural = "Respuestas"
    fields = ('respuesta', 'get_fecha', 'get_usuario')
    readonly_fields = ('get_fecha', 'get_usuario')
    
    def get_fecha(self, obj):
        return obj.respuesta.fecha_creacion if obj.respuesta else '-'
    get_fecha.short_description = 'Fecha'
    
    def get_usuario(self, obj):
        return obj.respuesta.usuario if obj.respuesta else '-'
    get_usuario.short_description = 'Usuario'

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'display_respuestas_count')
    search_fields = ('nombre',)
    inlines = [RespuestasInline]
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            _respuestas_count=Count('respuestatag')
        )
    
    def display_respuestas_count(self, obj):
        count = getattr(obj, '_respuestas_count', obj.get_respuestas_count())
        return format_html(
            '<span class="count-badge">{}</span>',
            count
        )
    display_respuestas_count.short_description = 'Número de Respuestas'
    display_respuestas_count.admin_order_field = '_respuestas_count'

    class Media:
        css = {
            'all': ('admin/css/custom.css',)
        }