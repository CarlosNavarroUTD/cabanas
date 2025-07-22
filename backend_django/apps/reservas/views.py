# apps/reservas/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import Q
from datetime import datetime
from .models import Reserva
from .serializers import ReservaSerializer
import stripe
import json
from apps.usuarios.permissions import PropietarioOAdministrador
from apps.cabanas.models import Cabana
import os
from dotenv import load_dotenv
from apps.teams.models import Team  # si no lo tienes ya importado

load_dotenv()

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated, PropietarioOAdministrador]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Reserva.objects.all()
        return Reserva.objects.filter(cliente__persona__usuario=user)

    @action(detail=True, methods=['post'], url_path='pagar')
    def iniciar_pago(self, request, pk=None):
        reserva = self.get_object()
        success_url = request.data.get('success_url')
        cancel_url = request.data.get('cancel_url')

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'mxn',
                    'product_data': {
                        'name': f'Reserva #{reserva.id}',
                    },
                    'unit_amount': int(reserva.precio_final * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={'reserva_id': reserva.id},
        )
        return Response({'checkout_url': session.url})


    @action(detail=False, methods=['get'], url_path='check-availability')
    def check_availability(self, request):
        cabana_id = request.query_params.get('cabana_id')
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if not all([cabana_id, fecha_inicio, fecha_fin]):
            return Response(
                {'error': 'Se requieren cabana_id, fecha_inicio y fecha_fin'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cabana = Cabana.objects.get(id=cabana_id)
        except Cabana.DoesNotExist:
            return Response(
                {'error': 'Cabaña no encontrada'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si hay reservas que se solapan
        reservas_solapadas = Reserva.objects.filter(
            reservacabana__cabana=cabana,
            estado__in=['pendiente', 'confirmada'],
        ).filter(
            Q(fecha_inicio__lt=fecha_fin) & Q(fecha_fin__gt=fecha_inicio)
        )

        disponible = not reservas_solapadas.exists()

        return Response({
            'available': disponible,
            'cabana_id': cabana_id,
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin
        })
    

    @action(detail=False, methods=['get'], url_path='por-equipo')
    def reservas_por_equipo(self, request):
        team_id = request.query_params.get('team_id')

        if not team_id:
            return Response({'error': 'Se requiere team_id'}, status=status.HTTP_400_BAD_REQUEST)

        reservas = Reserva.objects.filter(
            reservacabana__cabana__team_id=team_id
        ).distinct()

        serializer = self.get_serializer(reservas, many=True)
        return Response(serializer.data)



@csrf_exempt
@api_view(['POST'])
@permission_classes([])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = os.getenv('STRIPE_ENDPOINT_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        reserva_id = session['metadata'].get('reserva_id')
        try:
            reserva = Reserva.objects.get(id=reserva_id)
            reserva.estado = 'confirmada'
            reserva.save()
        except Reserva.DoesNotExist:
            pass

    return HttpResponse(status=200)