from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Persona, Arrendador, Persona

Usuario = get_user_model()

@receiver(post_save, sender=Usuario)
def create_persona(sender, instance, created, **kwargs):
    if created:
        # Crear una instancia de Persona asociada al Usuario
        persona = Persona.objects.create(id_usuario=instance)

        # Verificar el tipo de usuario y crear un Arrendador o Cliente
        if instance.tipo_usuario == 'arrendador':
            Arrendador.objects.create(id_arrendador=persona)
        elif instance.tipo_usuario == 'cliente':
            Cliente.objects.create(id_cliente=persona)


@receiver(post_save, sender=Usuario)
def save_persona(sender, instance, **kwargs):
    instance.persona.save()

