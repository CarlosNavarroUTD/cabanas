from rest_framework import serializers
from .models import Producto, ProductoRopa, ProductoElectronica

class ProductoRopaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoRopa
        fields = ['talla', 'genero', 'material']

class ProductoElectronicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoElectronica
        fields = ['marca', 'modelo', 'garantia_meses']

class ProductoSerializer(serializers.ModelSerializer):
    ropa = ProductoRopaSerializer(required=False, allow_null=True)
    electronica = ProductoElectronicaSerializer(required=False, allow_null=True)
    
    class Meta:
        model = Producto
        fields = [
            'id', 'sitio', 'nombre', 'descripcion', 'precio', 
            'tipo', 'creado_en', 'ropa', 'electronica'
        ]
        read_only_fields = ['creado_en']
    
    def create(self, validated_data):
        # Extraer los datos de los productos específicos
        ropa_data = validated_data.pop('ropa', None)
        electronica_data = validated_data.pop('electronica', None)
        
        # Crear el producto base
        producto = Producto.objects.create(**validated_data)
        
        # Crear los productos específicos según el tipo
        if validated_data.get('tipo') == 'ropa' and ropa_data:
            ProductoRopa.objects.create(producto=producto, **ropa_data)
        elif validated_data.get('tipo') == 'electronica' and electronica_data:
            ProductoElectronica.objects.create(producto=producto, **electronica_data)
        
        return producto
    
    def update(self, instance, validated_data):
        # Extraer los datos de los productos específicos
        ropa_data = validated_data.pop('ropa', None)
        electronica_data = validated_data.pop('electronica', None)
        
        # Actualizar los campos del producto base
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Actualizar o crear los productos específicos según el tipo
        if instance.tipo == 'ropa' and ropa_data:
            try:
                ropa = instance.ropa
                for attr, value in ropa_data.items():
                    setattr(ropa, attr, value)
                ropa.save()
            except ProductoRopa.DoesNotExist:
                ProductoRopa.objects.create(producto=instance, **ropa_data)
        
        elif instance.tipo == 'electronica' and electronica_data:
            try:
                electronica = instance.electronica
                for attr, value in electronica_data.items():
                    setattr(electronica, attr, value)
                electronica.save()
            except ProductoElectronica.DoesNotExist:
                ProductoElectronica.objects.create(producto=instance, **electronica_data)
        
        return instance