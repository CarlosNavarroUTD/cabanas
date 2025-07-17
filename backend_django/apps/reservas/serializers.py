from rest_framework import serializers
from .models import Usuario, Persona, Arrendador, Cliente

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre_usuario', 'email', 'tipo_usuario', 
                 'password', 'is_active', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'read_only': True},
            'is_staff': {'read_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario.objects.create_user(
            password=password,
            **validated_data
        )
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class PersonaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)
    id_usuario = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        write_only=True
    )

    class Meta:
        model = Persona
        fields = ['id_persona', 'id_usuario', 'usuario', 'nombre', 
                 'apellido', 'dni']

class ArrendadorSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(source='id_arrendador', read_only=True)
    id_arrendador = serializers.PrimaryKeyRelatedField(
        queryset=Persona.objects.all(),
        write_only=True
    )

    class Meta:
        model = Arrendador
        fields = ['id_arrendador', 'persona']

    def validate_id_arrendador(self, value):
        if value.id_usuario.tipo_usuario != 'arrendador':
            raise serializers.ValidationError(
                "El usuario debe ser de tipo arrendador"
            )
        return value

class ClienteSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(source='id_cliente', read_only=True)
    id_cliente = serializers.PrimaryKeyRelatedField(
        queryset=Persona.objects.all(),
        write_only=True
    )

    class Meta:
        model = Cliente
        fields = ['id_cliente', 'persona']

    def validate_id_cliente(self, value):
        if value.id_usuario.tipo_usuario != 'cliente':
            raise serializers.ValidationError(
                "El usuario debe ser de tipo cliente"
            )
        return value