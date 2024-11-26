from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Persona, Arrendador, Cliente

Usuario = get_user_model()

@receiver(post_save, sender=Usuario)
def create_or_update_related_models(sender, instance, created, **kwargs):
    if created:
        # Always create a Persona instance when a user is created, even if the fields are empty
        Persona.objects.get_or_create(usuario=instance)
        
        # Conditionally create Arrendador or Cliente based on the tipo_usuario
        if instance.tipo_usuario == 'arrendador':
            Arrendador.objects.get_or_create(usuario=instance)
        elif instance.tipo_usuario == 'cliente':
            Cliente.objects.get_or_create(usuario=instance)
    else:
        # If the user is updated, ensure Persona is also updated
        if hasattr(instance, 'persona'):
            instance.persona.save()
        
        # Update Arrendador or Cliente if they exist
        if hasattr(instance, 'arrendador_relation'):
            instance.arrendador_relation.save()
        if hasattr(instance, 'cliente_relation'):
            instance.cliente_relation.save()
