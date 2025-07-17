# apps/usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario, Persona

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
    fields = ('nombre', 'apellido')
    extra = 1

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
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

# No es necesario registrar Persona por separado