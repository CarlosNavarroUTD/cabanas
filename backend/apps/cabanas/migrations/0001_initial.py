# Generated by Django 4.2.9 on 2024-11-15 06:29

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('usuarios', '0002_alter_persona_dni'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cabana',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('slug', models.SlugField(blank=True, unique=True)),
                ('descripcion', models.TextField()),
                ('descripcion_corta', models.CharField(max_length=200)),
                ('capacidad', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('capacidad_maxima', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('costo_por_noche', models.DecimalField(decimal_places=2, max_digits=10)),
                ('costo_limpieza', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('deposito_garantia', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('metros_cuadrados', models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True)),
                ('num_habitaciones', models.IntegerField(default=1)),
                ('num_banos', models.DecimalField(decimal_places=1, default=1, max_digits=3)),
                ('tiene_alberca', models.BooleanField(default=False)),
                ('tiene_jacuzzi', models.BooleanField(default=False)),
                ('acepta_mascotas', models.BooleanField(default=False)),
                ('estado', models.CharField(choices=[('disponible', 'Disponible'), ('ocupada', 'Ocupada'), ('mantenimiento', 'En Mantenimiento'), ('inactiva', 'Inactiva')], default='disponible', max_length=20)),
                ('es_destacada', models.BooleanField(default=False)),
                ('check_in', models.TimeField(default='15:00')),
                ('check_out', models.TimeField(default='11:00')),
                ('tiempo_minimo_estadia', models.IntegerField(default=1)),
                ('tiempo_maximo_estadia', models.IntegerField(blank=True, null=True)),
                ('calificacion_promedio', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('num_resenas', models.IntegerField(default=0)),
                ('veces_reservada', models.IntegerField(default=0)),
                ('creada_en', models.DateTimeField(auto_now_add=True)),
                ('actualizada_en', models.DateTimeField(auto_now=True)),
                ('arrendador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.arrendador')),
            ],
            options={
                'ordering': ['-es_destacada', '-calificacion_promedio'],
            },
        ),
        migrations.CreateModel(
            name='Servicio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('icono', models.CharField(max_length=50)),
                ('descripcion', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ubicacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('estado', models.CharField(max_length=50)),
                ('ciudad', models.CharField(max_length=50)),
                ('codigo_postal', models.CharField(max_length=10)),
                ('latitud', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('longitud', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PoliticaCabana',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('orden', models.IntegerField(default=0)),
                ('cabana', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='politicas', to='cabanas.cabana')),
            ],
            options={
                'ordering': ['orden'],
            },
        ),
        migrations.CreateModel(
            name='ImagenCabana',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='cabanas/')),
                ('es_principal', models.BooleanField(default=False)),
                ('orden', models.IntegerField(default=0)),
                ('titulo', models.CharField(blank=True, max_length=100)),
                ('creada_en', models.DateTimeField(auto_now_add=True)),
                ('cabana', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='imagenes', to='cabanas.cabana')),
            ],
            options={
                'ordering': ['orden', 'creada_en'],
            },
        ),
        migrations.AddField(
            model_name='cabana',
            name='servicios',
            field=models.ManyToManyField(to='cabanas.servicio'),
        ),
        migrations.AddField(
            model_name='cabana',
            name='ubicacion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='cabanas.ubicacion'),
        ),
        migrations.CreateModel(
            name='Resena',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('calificacion', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('comentario', models.TextField()),
                ('fecha_estadia', models.DateField()),
                ('creada_en', models.DateTimeField(auto_now_add=True)),
                ('actualizada_en', models.DateTimeField(auto_now=True)),
                ('cabana', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resenas', to='cabanas.cabana')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-creada_en'],
                'unique_together': {('cabana', 'usuario', 'fecha_estadia')},
            },
        ),
        migrations.CreateModel(
            name='DisponibilidadCabana',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('esta_disponible', models.BooleanField(default=True)),
                ('precio_especial', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('cabana', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='disponibilidad', to='cabanas.cabana')),
            ],
            options={
                'ordering': ['fecha'],
                'unique_together': {('cabana', 'fecha')},
            },
        ),
    ]
