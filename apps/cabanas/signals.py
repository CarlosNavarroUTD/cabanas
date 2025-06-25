from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Resena, Cabana, ImagenCabana

@receiver(post_save, sender=Resena)
def actualizar_calificacion_cabana(sender, instance, created, **kwargs):
    """
    Actualiza la calificación promedio y el número de reseñas de una cabaña
    cuando se crea o modifica una reseña
    """
    cabana = instance.cabana
    # Calcular nuevo promedio
    promedio = Resena.objects.filter(cabana=cabana).aggregate(Avg('calificacion'))
    cabana.calificacion_promedio = promedio['calificacion__avg'] or 0
    # Actualizar número de reseñas
    cabana.num_resenas = Resena.objects.filter(cabana=cabana).count()
    cabana.save()

@receiver(post_delete, sender=Resena)
def actualizar_calificacion_cabana_delete(sender, instance, **kwargs):
    """
    Actualiza la calificación cuando se elimina una reseña
    """
    cabana = instance.cabana
    promedio = Resena.objects.filter(cabana=cabana).aggregate(Avg('calificacion'))
    cabana.calificacion_promedio = promedio['calificacion__avg'] or 0
    cabana.num_resenas = Resena.objects.filter(cabana=cabana).count()
    cabana.save()

@receiver(post_save, sender=ImagenCabana)
def asegurar_una_imagen_principal(sender, instance, created, **kwargs):
    """
    Asegura que solo haya una imagen principal por cabaña
    """
    if instance.es_principal:
        # Desmarcar otras imágenes principales
        ImagenCabana.objects.filter(
            cabana=instance.cabana,
            es_principal=True
        ).exclude(id=instance.id).update(es_principal=False)
    elif not ImagenCabana.objects.filter(cabana=instance.cabana, es_principal=True).exists():
        # Si no hay imagen principal, hacer esta la principal
        instance.es_principal = True
        instance.save()