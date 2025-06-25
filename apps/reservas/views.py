from django.shortcuts import render
from .models import Reserva

def listar_reservas(request):
    reservas = Reserva.objects.all()
    return render(request, 'reservas/list.html', {'reservas': reservas})
