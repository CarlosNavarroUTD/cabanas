# models.py - Modelo mejorado
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from apps.teams.models import Team

User = get_user_model()

class Tienda(models.Model):
    TEMPLATES = [
        ('plantilla1', 'Clásico'),
        ('plantilla2', 'Moderno'),
        ('plantilla3', 'Minimalista'),
    ]

    propietario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='tiendas'
    )
    teams = models.ManyToManyField(
        Team, 
        related_name='stores', 
        blank=True,
        help_text="Equipos que tienen acceso a esta tienda"
    )
    
    # Información básica
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(
        unique=True,
        max_length=50,
        validators=[
            RegexValidator(
                regex=r'^[a-z0-9-]+$',
                message='El slug solo puede contener letras minúsculas, números y guiones.'
            )
        ],
        help_text="Usado para generar subdominios (ej: tienda.ejemplo.com)"
    )
    plantilla = models.CharField(
        max_length=20, 
        choices=TEMPLATES, 
        default='plantilla1'
    )
    dominio_personalizado = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        unique=True,
        help_text="Dominio personalizado (ej: mitienda.com)"
    )

    # Configuración visual
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    color_primario = models.CharField(
        max_length=7, 
        default='#3498db',
        validators=[
            RegexValidator(
                regex=r'^#[0-9A-Fa-f]{6}$',
                message='Debe ser un color hexadecimal válido (ej: #3498db)'
            )
        ]
    )
    color_secundario = models.CharField(
        max_length=7, 
        default='#2ecc71',
        validators=[
            RegexValidator(
                regex=r'^#[0-9A-Fa-f]{6}$',
                message='Debe ser un color hexadecimal válido (ej: #2ecc71)'
            )
        ]
    )
    fuente = models.CharField(max_length=100, default='Inter')
    
    # Configuraciones adicionales
    configuracion_extra = models.JSONField(
        default=dict, 
        blank=True,
        help_text="Configuraciones adicionales como banners, layout, etc."
    )
    
    # Estado
    activa = models.BooleanField(default=True)
    
    # Timestamps
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-creado_en']
        verbose_name = 'Tienda'
        verbose_name_plural = 'Tiendas'

    def __str__(self):
        return f"{self.nombre} ({self.slug})"
    
    def get_absolute_url(self):
        """Retorna la URL del subdominio de la tienda"""
        from django.conf import settings
        base_domain = getattr(settings, 'STORE_BASE_DOMAIN', 'example.com')
        return f"https://{self.slug}.{base_domain}"
