from django import forms
from .models import Respuesta, Tag

class RespuestaForm(forms.ModelForm):
    class Meta:
        model = Respuesta
        fields = ['contenido', 'usuario']

class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['nombre']
