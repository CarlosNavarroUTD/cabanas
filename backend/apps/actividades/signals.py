from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import Paquete
from django.core.cache import cache

@receiver(post_save, sender=Paquete)
def actualizar_cache_paquete(sender, instance, created, **kwargs):
    cache_key = f'paquete_{instance.id}'
    cache.set(cache_key, instance, timeout=3600)  # Cache por 1 hora

@receiver(pre_delete, sender=Paquete)
def eliminar_cache_paquete(sender, instance, **kwargs):
    cache_key = f'paquete_{instance.id}'
    cache.delete(cache_key)