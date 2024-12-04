# apps/usuarios/serializers.py
from rest_framework import serializers, status, permissions
from .models import Usuario, Persona, Arrendador, Cliente

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    persona_info = serializers.SerializerMethodField()
    arrendador_info = serializers.SerializerMethodField()  # Nuevo campo

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre_usuario', 'email', 'tipo_usuario', 
                 'password', 'is_active', 'is_staff', 'persona_info', 'arrendador_info']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'read_only': True},
            'is_staff': {'read_only': True},
            'tipo_usuario': {'read_only': True}
        }

    def get_persona_info(self, obj):
        try:
            persona = obj.persona
            return {
                'id_persona': persona.id_persona,
                'nombre': persona.nombre,
                'apellido': persona.apellido,
                'dni': persona.dni
            }
        except Persona.DoesNotExist:
            return None

    def get_arrendador_info(self, obj):
        if obj.tipo_usuario == 'arrendador':
            try:
                # Use the correct related name or query method for your model
                arrendador = Arrendador.objects.get(usuario=obj)
                return {
                    'id_arrendador': arrendador.id_arrendador,
                    'nombre': arrendador.nombre
                }
            except Arrendador.DoesNotExist:
                return None
        return None

    def validate(self, data):
        # Si se proporciona contraseña, validar requisitos
        if 'password' in data:
            password = data['password']
            if len(password) < 8:
                raise serializers.ValidationError({
                    'password': "La contraseña debe tener al menos 8 caracteres"
                })
            
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario.objects.create_user(
            nombre_usuario=validated_data.get('nombre_usuario'),
            email=validated_data.get('email'),
            password=password,
            tipo_usuario=validated_data.get('tipo_usuario', 'cliente')
        )
        return user

    def update(self, instance, validated_data):
        print(f"Update method called for user: {instance}")
        print(f"Validated data: {validated_data}")


        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class PersonaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Persona
        fields = ['id_persona', 'usuario', 'nombre', 'apellido', 'dni']
    
    def validate(self, data):
        # Validaciones de campos requeridos
        required_fields = ['nombre', 'apellido', 'dni']
        for field in required_fields:
            if field not in data or not data[field]:
                raise serializers.ValidationError({field: "Este campo es obligatorio"})
        
        # Validar formato de DNI si es necesario
        if 'dni' in data:
            if not data['dni'].isdigit() or len(data['dni']) < 7:
                raise serializers.ValidationError({
                    'dni': "El DNI debe contener solo números y tener al menos 7 dígitos"
                })
        
        return data

    def update(self, instance, validated_data):
        # Validar campos requeridos
        if not all([validated_data.get('nombre'), 
                    validated_data.get('apellido'), 
                    validated_data.get('dni')]):
            raise serializers.ValidationError("Nombre, apellido y DNI son obligatorios")
        
        return super().update(instance, validated_data)


class ArrendadorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Arrendador
        fields = ['id_arrendador', 'usuario', 'nombre']

    def validate(self, data):
        if self.instance is None and 'usuario' in data:
            if data['usuario'].tipo_usuario != 'arrendador':
                raise serializers.ValidationError(
                    "El usuario debe ser de tipo arrendador"
                )
        return data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['nombre'] = instance.nombre  # Asegura que el nombre esté incluido
        return rep



class ClienteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Cliente
        fields = ['id_cliente', 'usuario']

    def validate(self, data):
        if self.instance is None and 'usuario' in data:
            if data['usuario'].tipo_usuario != 'cliente':
                raise serializers.ValidationError(
                    "El usuario debe ser de tipo cliente"
                )
        return data
