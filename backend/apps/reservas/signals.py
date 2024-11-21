from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Persona

Usuario = get_user_model()

@receiver(post_save, sender=Usuario)
def create_persona(sender, instance, created, **kwargs):
    if created:
        Persona.objects.create(id_usuario=instance)

@receiver(post_save, sender=Usuario)
def save_persona(sender, instance, **kwargs):
    instance.persona.save()