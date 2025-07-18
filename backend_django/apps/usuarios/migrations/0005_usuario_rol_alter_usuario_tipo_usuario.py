# Generated by Django 5.1.2 on 2025-06-18 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0004_arrendador_cliente'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='rol',
            field=models.CharField(choices=[('cliente', 'Cliente'), ('arrendador', 'Arrendador'), ('otro', 'Otro')], default='cliente', max_length=20),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='tipo_usuario',
            field=models.CharField(choices=[('administrador', 'Administrador'), ('usuario', 'Usuario')], default='usuario', max_length=20),
        ),
    ]
