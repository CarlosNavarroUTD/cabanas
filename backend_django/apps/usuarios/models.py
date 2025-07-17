# apps/usuarios/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('tipo_usuario', 'administrador')
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)
    nombre_usuario = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)  # 👈 Añadir este campo opcional

    tipo_usuario = models.CharField(max_length=20, choices=[
        ('administrador', 'Administrador'),
        ('usuario', 'Usuario'),
    ],
    default='usuario'
    )
    
    ROL_CHOICES = [
        ('cliente', 'Cliente'),
        ('arrendador', 'Arrendador'),
        ('otro', 'Otro'),
    ]
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='cliente')

    phone = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre_usuario', 'tipo_usuario']

    class Meta:
        db_table = 'Usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.email

class Persona(models.Model):
    id_persona = models.AutoField(primary_key=True)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='persona')
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)

    class Meta:
        db_table = 'Persona'
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
class Arrendador(models.Model):
    id_arrendador = models.AutoField(primary_key=True)
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE, related_name='arrendador')

    def __str__(self):
        return f"Arrendador: {self.persona}"
    
class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE, related_name='cliente')

    def __str__(self):
        return f"Cliente: {self.persona}"

