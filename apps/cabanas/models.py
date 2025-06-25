# apps/cabanas/models.py - Versión completada

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from apps.usuarios.models import Usuario
from apps.teams.models import Team


class Ubicacion(models.Model):
    estado = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=50)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.ciudad}, {self.estado}"

    class Meta:
        verbose_name = 'Ubicación'
        verbose_name_plural = 'Ubicaciones'
        unique_together = ['estado', 'ciudad', 'codigo_postal']


class Servicio(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    icono = models.CharField(max_length=100, blank=True, null=True, help_text="Ruta del icono en el frontend")
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'
        ordering = ['nombre']


class Cabana(models.Model):
    # Solo mantendremos estos estados según los requerimientos
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('inactiva', 'Inactiva'),
    ]

    # Campos básicos
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='cabanas')
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    slug = models.SlugField(unique=True, blank=True, null=True)

    # Capacidad y precios
    capacidad = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    costo_por_noche = models.DecimalField(max_digits=10, decimal_places=2)

    # Ubicación y características
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, related_name='cabanas')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')

    # Servicios
    servicios = models.ManyToManyField(Servicio, blank=True)

    # Campos adicionales útiles
    superficie = models.FloatField(null=True, blank=True, help_text="Superficie en m²")
    numero_habitaciones = models.PositiveIntegerField(null=True, blank=True)
    numero_banos = models.PositiveIntegerField(null=True, blank=True)
    permite_mascotas = models.BooleanField(default=False)
    
    # Reglas de la casa
    reglas_casa = models.TextField(blank=True, null=True)
    hora_checkin = models.TimeField(null=True, blank=True)
    hora_checkout = models.TimeField(null=True, blank=True)

    # Campos de auditoría
    creada_en = models.DateTimeField(auto_now_add=True)
    actualizada_en = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.nombre)
            slug = base_slug
            counter = 1
            while Cabana.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Cabaña'
        verbose_name_plural = 'Cabañas'
        ordering = ['-creada_en']
        indexes = [
            models.Index(fields=['estado']),
            models.Index(fields=['slug']),
            models.Index(fields=['ubicacion']),
        ]

    @property
    def calificacion_promedio(self):
        from django.db.models import Avg
        promedio = self.resenas.aggregate(Avg('calificacion'))['calificacion__avg']
        return round(promedio, 1) if promedio else 0

    @property
    def total_resenas(self):
        return self.resenas.count()

    @property
    def imagen_principal(self):
        return self.imagenes.filter(es_principal=True).first()


class ImagenCabana(models.Model):
    cabana = models.ForeignKey(Cabana, related_name='imagenes', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='cabanas/%Y/%m/')
    es_principal = models.BooleanField(default=False)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    orden = models.PositiveIntegerField(default=0)
    creada_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Imagen de {self.cabana.nombre}"

    class Meta:
        verbose_name = 'Imagen de Cabaña'
        verbose_name_plural = 'Imágenes de Cabañas'
        ordering = ['orden', '-creada_en']


class Resena(models.Model):
    cabana = models.ForeignKey(Cabana, related_name='resenas', on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    calificacion = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comentario = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reseña de {self.usuario} para {self.cabana.nombre}"

    class Meta:
        verbose_name = 'Reseña'
        verbose_name_plural = 'Reseñas'
        ordering = ['-fecha_creacion']
        unique_together = ['cabana', 'usuario']  # Un usuario solo puede reseñar una vez por cabaña