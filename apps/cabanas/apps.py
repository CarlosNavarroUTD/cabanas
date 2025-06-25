from django.apps import AppConfig

class CabanasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cabanas'  # Ajusta esto según la estructura de tu proyecto

    def ready(self):
        import apps.cabanas.signals  # Importa las señales cuando la app se inicia