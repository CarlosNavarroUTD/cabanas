#backend/myproject/settings/production.py
import os
from .base import *
import dj_database_url
from datetime import timedelta
from dotenv import load_dotenv


load_dotenv()

DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Configuración de ALLOWED_HOSTS
DEFAULT_ALLOWED_HOSTS = 'localhost,127.0.0.1,0.0.0.0,0.0.0.0:8081,cabanas-mexiquillo.fly.dev,172.19.1.210,172.19.2.2,172.19.0.0/16,172.19.2.2:8000,172.19.1.210:8000'
additional_hosts = os.getenv('ALLOWED_HOSTS', DEFAULT_ALLOWED_HOSTS).split(',')
ALLOWED_HOSTS = [host.strip() for host in additional_hosts if host.strip()]

# Configuración de la base de datos
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Configuraciones de seguridad
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 año
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Configuración de archivos estáticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configuración de CORS mejorada
CORS_ALLOWED_ORIGINS = [
    f"https://{host.strip()}" for host in os.environ.get('CORS_ALLOWED_ORIGINS', 'cabanas-mexiquillo.fly.dev').split(',')
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Configuración de JWT
SIMPLE_JWT = {
    **SIMPLE_JWT,
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'SIGNING_KEY': os.environ.get('JWT_SECRET_KEY', SECRET_KEY),
}

# Middleware
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Logging mejorado
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            #'level': os.getenv('DJANGO_LOG_LEVEL', 'WARNING'),
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# Cache configuration (uncomment and configure as needed)
"""
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
    }
}
"""

# Public paths
PUBLIC_PATHS = [
    '/health/',
    '/api/token/',
    '/api/token/refresh/',
]

# Configuración de WhiteNoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configurar WhiteNoise para servir archivos estáticos en producción
if not DEBUG:
    WHITENOISE_USE_FINDERS = True
    WHITENOISE_MANIFEST_STRICT = False
    WHITENOISE_ALLOW_ALL_ORIGINS = True
