from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Custom manager for the Usuario model
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
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)
    nombre_usuario = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    tipo_usuario = models.CharField(max_length=20, choices=[
        ('cliente', 'Cliente'),
        ('arrendador', 'Arrendador'),
        ('admin', 'Administrador'),
    ])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre_usuario', 'tipo_usuario']

    @property
    def arrendador(self):
        if hasattr(self, 'persona') and hasattr(self.persona, 'arrendador'):
            return self.persona.arrendador
        return None
        
    class Meta:
        db_table = 'Usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.email

class Persona(models.Model):
    id_persona = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    dni = models.CharField(max_length=20, unique=True, null=True, blank=True)

    class Meta:
        db_table = 'Persona'
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Arrendador(models.Model):
    id_arrendador = models.OneToOneField(Persona, on_delete=models.CASCADE, primary_key=True)

    class Meta:
        db_table = 'Arrendador'
        verbose_name = 'Arrendador'
        verbose_name_plural = 'Arrendadores'

    def __str__(self):
        return f"Arrendador: {self.id_arrendador}"

class Cliente(models.Model):
    id_cliente = models.OneToOneField(Persona, on_delete=models.CASCADE, primary_key=True)

    class Meta:
        db_table = 'Cliente'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"Cliente: {self.id_cliente}"
