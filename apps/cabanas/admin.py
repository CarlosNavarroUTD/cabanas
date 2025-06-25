# apps/cabanas/admin.py
from django.contrib import admin
from .models import Cabana, Ubicacion, Servicio, ImagenCabana, Resena
from apps.teams.models import Team, TeamMember  # 👈 Asegúrate de importar estos si están en otra app

class CabanaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'team', 'capacidad', 'estado']  # 👈 arrendador -> team
    list_filter = ['estado', 'team']  # 👈 arrendador -> team
    search_fields = ['nombre', 'team__name']  # 👈 búsqueda por nombre de equipo

    def save_model(self, request, obj, form, change):
        """
        Asigna automáticamente el equipo del arrendador al crear una cabaña.
        Supone que el usuario pertenece a un solo equipo.
        """
        if not change:
            try:
                team_member = request.user.teams.first()  # 👈 obtiene el primer equipo del usuario
                obj.team = team_member.team
            except AttributeError:
                from django.contrib import messages
                messages.warning(request, "No se pudo asignar automáticamente el equipo.")
        
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        try:
            team_ids = request.user.teams.values_list('team_id', flat=True)
            return qs.filter(team_id__in=team_ids)
        except AttributeError:
            return qs.none()


# Registros de modelos en el admin
admin.site.register(Cabana, CabanaAdmin)
admin.site.register(Ubicacion)
admin.site.register(Servicio)
admin.site.register(ImagenCabana)
admin.site.register(Resena)