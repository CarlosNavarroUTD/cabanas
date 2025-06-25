from .base import *
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Carga el archivo .env
load_dotenv(os.path.join(BASE_DIR, '.env'))


DEBUG = False



# Production database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),  # ← Esto debe apuntar a Fly.io o tu servidor externo
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

