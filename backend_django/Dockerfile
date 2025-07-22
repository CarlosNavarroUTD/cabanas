# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.13-slim
FROM python:${PYTHON_VERSION}

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=myproject.settings.production \
    PORT=8000

# Crear directorio de trabajo
RUN mkdir -p /code
WORKDIR /code

# Instalar dependencias
COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/

# Copiar código
COPY . /code

# Exponer el puerto
EXPOSE 8000

# Comando por defecto
CMD ["gunicorn", "--bind", ":8000", "--workers", "1", "myproject.wsgi:application"]
