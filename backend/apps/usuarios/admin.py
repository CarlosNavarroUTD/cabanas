# apps/usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario, Persona, Arrendador
from .forms import PersonaForm
from .models import models


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = ('email', 'nombre_usuario', 'tipo_usuario')

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Usuario
        fields = ('email', 'nombre_usuario', 'tipo_usuario')

class PersonaInline(admin.StackedInline):
    model = Persona
    can_delete = False
    verbose_name_plural = 'Información Personal'
    fields = ('nombre', 'apellido', 'dni')
    extra = 1
    formfield_overrides = {
        models.CharField: {'required': False},
    }

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    search_fields = ['email', 'nombre_usuario']
    list_display = ('email', 'nombre_usuario', 'tipo_usuario', 'is_active')
    list_filter = ('is_active', 'tipo_usuario')
    
    list_display = ('email', 'nombre_usuario', 'tipo_usuario', 'get_nombre_completo', 'is_active', 'is_staff')
    list_filter = ('tipo_usuario', 'is_active', 'is_staff')
    search_fields = ('email', 'nombre_usuario', 'persona__nombre', 'persona__apellido')
    ordering = ('email',)
    
    fieldsets = (
        (None, {
            'fields': ('email', 'nombre_usuario', 'password')
        }),
        ('Información de Acceso', {
            'fields': ('tipo_usuario',)
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre_usuario', 'tipo_usuario', 'password1', 'password2'),
        }),
    )
    
    inlines = [PersonaInline]

    def get_nombre_completo(self, obj):
        try:
            persona = obj.persona
            return f"{persona.nombre} {persona.apellido}"
        except Persona.DoesNotExist:
            return "Sin información personal"
    get_nombre_completo.short_description = 'Nombre Completo'


@admin.register(Arrendador)
class ArrendadorAdmin(admin.ModelAdmin):
    list_display = ['get_nombre', 'get_email', 'get_tipo_usuario']
    search_fields = ['id_arrendador__nombre', 'id_arrendador__apellido', 'id_arrendador__id_usuario__email']

    def get_nombre(self, obj):
        return f"{obj.id_arrendador.nombre} {obj.id_arrendador.apellido}"
    get_nombre.short_description = 'Nombre Completo'

    def get_email(self, obj):
        return obj.id_arrendador.id_usuario.email
    get_email.short_description = 'Correo Electrónico'

    def get_tipo_usuario(self, obj):
        return obj.id_arrendador.id_usuario.tipo_usuario
    get_tipo_usuario.short_description = 'Tipo de Usuario'

