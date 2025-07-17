# backend/apps/usuarios/serializers.py

from rest_framework import serializers
from .models import Usuario, Persona

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['id_persona', 'nombre', 'apellido']

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

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if persona_data and hasattr(instance, 'persona'):
            for attr, value in persona_data.items():
                setattr(instance.persona, attr, value)
            instance.persona.save()
        elif persona_data:
            Persona.objects.create(usuario=instance, **persona_data)

        return instance