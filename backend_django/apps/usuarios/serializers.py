# backend/apps/usuarios/serializers.py

from rest_framework import serializers
from .models import Usuario, Persona, Cliente, Arrendador


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id_cliente']

class ArrendadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arrendador
        fields = ['id_arrendador']

class PersonaSerializer(serializers.ModelSerializer):
    cliente = serializers.SerializerMethodField()
    arrendador = serializers.SerializerMethodField()

    class Meta:
        model = Persona
        fields = ['id_persona', 'nombre', 'apellido', 'cliente', 'arrendador']

    def get_cliente(self, obj):
        try:
            return ClienteSerializer(obj.cliente).data
        except Cliente.DoesNotExist:
            return None

    def get_arrendador(self, obj):
        try:
            return ArrendadorSerializer(obj.arrendador).data
        except Arrendador.DoesNotExist:
            return None


class UsuarioSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(required=False, allow_null=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre_usuario', 'email', 'tipo_usuario', 'rol', 'phone', 'password', 'persona']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone': {'required': False}
        }

    def create(self, validated_data):
        persona_data = validated_data.pop('persona', None)
        rol = validated_data.get('rol', 'cliente')  # No pop, keep it in validated_data
        password = validated_data.pop('password')
        
        # Create user - signal will automatically create Persona
        usuario = Usuario.objects.create_user(password=password, **validated_data)
        
        # Update the Persona created by signal with provided data
        if persona_data:
            persona = usuario.persona  # Get the Persona created by signal
            persona.nombre = persona_data.get('nombre', '')
            persona.apellido = persona_data.get('apellido', '')
            persona.save()
            
            # Create Cliente or Arrendador based on rol
            if rol == 'cliente':
                from .models import Cliente
                Cliente.objects.create(persona=persona)
            elif rol == 'arrendador':
                from .models import Arrendador
                Arrendador.objects.create(persona=persona)
        
        return usuario

    def update(self, instance, validated_data):
        persona_data = validated_data.pop('persona', None)
        password = validated_data.pop('password', None)
        rol = validated_data.get('rol', instance.rol)  # Usar nuevo rol si se actualiza

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if persona_data:
            persona = getattr(instance, 'persona', None)
            if persona:
                for attr, value in persona_data.items():
                    setattr(persona, attr, value)
                persona.save()
            else:
                persona = Persona.objects.create(usuario=instance, **persona_data)
        
            # Crear Cliente o Arrendador si no existen aún
            if rol == 'cliente' and not hasattr(persona, 'cliente'):
                from .models import Cliente
                Cliente.objects.create(persona=persona)
            elif rol == 'arrendador' and not hasattr(persona, 'arrendador'):
                from .models import Arrendador
                Arrendador.objects.create(persona=persona)

        return instance
