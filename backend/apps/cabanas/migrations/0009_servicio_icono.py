# Generated by Django 4.2.9 on 2024-11-22 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cabanas', '0008_alter_cabana_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicio',
            name='icono',
            field=models.CharField(blank=True, help_text='Ruta del icono en el frontend', max_length=100, null=True),
        ),
    ]