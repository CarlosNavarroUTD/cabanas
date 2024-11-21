from django.apps import AppConfig

class ActividadesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.actividades'  # Ajusta esto según la estructura de tu proyecto

    def ready(self):
        import apps.actividades.signals  # Importa las señales cuando la app se inicia