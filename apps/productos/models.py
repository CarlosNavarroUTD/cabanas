# productos/models.py
from django.db import models
from tiendas.models import Tienda

class Producto(models.Model):
    sitio = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=50, choices=[
        ('ropa', 'Ropa'),
        ('electronica', 'Electrónica'),
        ('comida', 'Comida'),
        ('servicio', 'Servicios'),
        ('libros', 'Libros'),
        ('hogar', 'Hogar y decoración'),
        ('belleza', 'Belleza y cuidado personal'),
        ('mascotas', 'Productos para mascotas'),
        ('juguetes', 'Juguetes y entretenimiento'),
        ('otros', 'Otros'),
    ])
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Producto base"
        verbose_name_plural = "Productos base"

    def __str__(self):
        return self.nombre

# productos/models.py
class ProductoRopa(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name='ropa')
    talla = models.CharField(max_length=10)
    genero = models.CharField(max_length=10)  # hombre, mujer, unisex
    material = models.CharField(max_length=100)

class ProductoElectronica(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name='electronica')
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    garantia_meses = models.PositiveIntegerField()
