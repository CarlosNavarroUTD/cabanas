# apps/usuarios/forms.py
from django import forms
from .models import Usuario, Persona

class UsuarioForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['email', 'nombre_usuario', 'tipo_usuario', 'password']
        widgets = {
            'password': forms.PasswordInput(),
        }

class PersonaForm(forms.ModelForm):
    class Meta:
        model = Persona
        fields = ['usuario', 'nombre', 'apellido']
