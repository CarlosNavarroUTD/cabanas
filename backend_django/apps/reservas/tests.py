from django.test import TestCase
from .models import Reserva

class ReservaModelTest(TestCase):
    def test_crear_reserva(self):
        reserva = Reserva.objects.create(cliente='Cliente Test')
        self.assertEqual(reserva.cliente, 'Cliente Test')
