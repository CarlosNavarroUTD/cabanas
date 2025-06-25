# apps/usuarios/models.py
from django.db import models
from apps.usuarios.models import Usuario


class Tag(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

    def get_respuestas_count(self):
        return self.respuestas.count()

class Respuesta(models.Model):
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='respuestas')
    tags = models.ManyToManyField(Tag, through='RespuestaTag', related_name='respuestas')
    order = models.IntegerField(default=0)  # Nuevo campo para el orden

    class Meta:
        verbose_name = 'Respuesta'
        verbose_name_plural = 'Respuestas'
        ordering = ['order']  # Cambiado de fecha_creacion a order

    def __str__(self):
        return f"{self.contenido[:50]}..." if len(self.contenido) > 50 else self.contenido

    @property
    def tags_list(self):
        return list(self.tags.values_list('nombre', flat=True))
    
class RespuestaTag(models.Model):
    respuesta = models.ForeignKey(Respuesta, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Etiqueta de Respuesta'
        verbose_name_plural = 'Etiquetas de Respuestas'
        unique_together = ('respuesta', 'tag')

    def __str__(self):
        return f"{self.tag.nombre} - {self.respuesta}"