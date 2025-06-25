# apps/responses/sigals.py 
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Respuesta

@receiver(post_save, sender=Respuesta)
def respuesta_creada(sender, instance, created, **kwargs):
    if created:
        # Lógica cuando se crea una nueva respuesta
        print(f"Respuesta creada: {instance.contenido}")
