#!/bin/bash
set -e

# Imprimir variables de entorno relevantes
echo "DATABASE_URL: $DATABASE_URL"
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"

# Verificar conexión a la base de datos
python manage.py check

# Listar todas las migraciones pendientes
python manage.py showmigrations

# Intentar crear migraciones
python manage.py makemigrations

# Mostrar migraciones detalladas
python manage.py migrate --verbosity 3

# Capturar estado de migración
if [ $? -ne 0 ]; then
    echo "Error durante las migraciones"
    exit 1
fi

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

# Iniciar Gunicorn
exec gunicorn myproject.wsgi:application --bind 0.0.0.0:8081