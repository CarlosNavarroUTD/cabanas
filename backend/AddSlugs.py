from django.db import migrations
from django.utils.text import slugify

def actualizar_slugs(apps, schema_editor):
    Cabana = apps.get_model('cabanas', 'Cabana')
    for cabana in Cabana.objects.all():
        base_slug = slugify(cabana.nombre)
        slug = base_slug
        n = 1
        # Buscar todas las cabañas que no sean esta y tengan el mismo slug
        while Cabana.objects.exclude(id=cabana.id).filter(slug=slug).exists():
            slug = f'{base_slug}-{n}'
            n += 1
        cabana.slug = slug
        cabana.save()

class Migration(migrations.Migration):

    dependencies = [
        ('cabanas', '0006_alter_cabana_slug'),
    ]

    operations = [
    ]
