from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# Nueva configuración para PostgreSQL
import os
from urllib.parse import urlparse

# Obtener la URL de la base de datos desde la variable de entorno o usar la proporcionada.
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://neondb_owner:rHjIMixvyb09@ep-proud-band-a5orqko0.us-east-2.aws.neon.tech/neondb?sslmode=require')

# Parsear la URL de la base de datos
url = urlparse(DATABASE_URL)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': url.path[1:],  # Remueve el primer caracter '/' de la URL
        'USER': url.username,
        'PASSWORD': url.password,
        'HOST': url.hostname,
        'PORT': url.port or 5432,  # 5432 es el puerto por defecto para PostgreSQL
        'OPTIONS': {
            'sslmode': 'require',  # Aseguramos que la conexión sea segura
        },
    }
}

# Ya que estás usando Docker, también es buena práctica agregar:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Y para desarrollo, podrías querer esto:
CORS_ALLOW_ALL_ORIGINS = True  # Solo en desarrollo
