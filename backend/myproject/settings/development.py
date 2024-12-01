from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Ya que estás usando Docker, también es buena práctica agregar:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Y para desarrollo, podrías querer esto:
CORS_ALLOW_ALL_ORIGINS = True  # Solo en desarrollo