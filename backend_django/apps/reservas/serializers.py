# apps/reservas/serializers.py
from rest_framework import serializers
from .models import Reserva, ReservaCabana
from apps.cabanas.models import Cabana

class ReservaCabanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaCabana
        fields = ['cabana']

class ReservaSerializer(serializers.ModelSerializer):
    cabanas = serializers.PrimaryKeyRelatedField(
        queryset=Cabana.objects.all(), many=True, write_only=True
    )

    class Meta:
        model = Reserva
        fields = ['id', 'cliente', 'fecha_inicio', 'fecha_fin', 'precio_final', 'estado', 'cabanas']
        read_only_fields = ['estado']

    def create(self, validated_data):
        cabanas = validated_data.pop('cabanas')
        reserva = Reserva.objects.create(**validated_data)
        for cabana in cabanas:
            ReservaCabana.objects.create(reserva=reserva, cabana=cabana)
        return reserva
