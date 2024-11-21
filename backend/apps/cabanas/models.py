from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from apps.usuarios.models import Arrendador, Usuario

class Ubicacion(models.Model):
    estado = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=50)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.ciudad}, {self.estado}"

class Servicio(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.nombre

class Cabana(models.Model):
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('ocupada', 'Ocupada'),
        ('mantenimiento', 'En Mantenimiento'),
        ('inactiva', 'Inactiva'),
    ]

    # Campos básicos
    arrendador = models.ForeignKey(Arrendador, on_delete=models.CASCADE, related_name='cabanas')
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    
    # Capacidad y precios
    capacidad = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    costo_por_noche = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Ubicación y características
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, related_name='cabanas', default=1)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')
    
    # Servicios
    servicios = models.ManyToManyField(Servicio, blank=True)
    
    # Campos de auditoría
    creada_en = models.DateTimeField(auto_now_add=True)
    actualizada_en = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

class ImagenCabana(models.Model):
    cabana = models.ForeignKey(Cabana, related_name='imagenes', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='cabanas/')
    es_principal = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Imagen de {self.cabana.nombre}"

class Resena(models.Model):
    cabana = models.ForeignKey(Cabana, related_name='resenas', on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    calificacion = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comentario = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['cabana', 'usuario']
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Reseña de {self.cabana.nombre} por {self.usuario.username}"

