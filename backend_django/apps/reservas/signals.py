
# apps/reservas/signals.py (opcional si quieres crear hooks automáticos al crear reservas)
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Reserva

@receiver(post_save, sender=Reserva)
def enviar_notificacion_reserva(sender, instance, created, **kwargs):
    if created:
        print(f"Nueva reserva creada: #{instance.id}")
