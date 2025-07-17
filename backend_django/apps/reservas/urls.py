from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.listar_reservas, name='listar_reservas'),
]
