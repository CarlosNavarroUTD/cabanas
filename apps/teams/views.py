from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Team, TeamMember, Invitation
from .serializers import (
    TeamSerializer, 
    TeamMemberSerializer, 
    InvitationSerializer,
    InviteMemberSerializer
)
from django.db.models import Q

class IsTeamAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los administradores del equipo
    modificar o eliminar el equipo.
    """
    
    def has_object_permission(self, request, view, obj):
        # Permitir GET, HEAD u OPTIONS a cualquier usuario
        if request.method in permissions.SAFE_METHODS:
            return True
            
        if view.action == 'leave_team':
            return True
        
        # Verificar si el usuario es administrador del equipo
        return TeamMember.objects.filter(
            team=obj,
            user=request.user,
            role='ADMIN'
        ).exists()

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamAdminOrReadOnly]
    
    def perform_create(self, serializer):
        # Crear el equipo y añadir al creador como administrador
        team = serializer.save()
        TeamMember.objects.create(
            team=team,
            user=self.request.user,
            role='ADMIN'
        )
    
    @action(detail=False, methods=['get'])
    def my_teams(self, request):
        """Obtener todos los equipos del usuario"""
        teams = Team.objects.filter(members__user=request.user)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='members')
    def members(self, request, pk=None):
        """Obtener todos los miembros de un equipo"""
        team = self.get_object()
        team_members = TeamMember.objects.filter(team=team)
        serializer = TeamMemberSerializer(team_members, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='invite_member')
    def invite_member(self, request, pk=None):
        """Invitar a un nuevo miembro al equipo"""
        team = self.get_object()
        
        # Verificar si el usuario es administrador del equipo
        if not TeamMember.objects.filter(team=team, user=request.user, role='ADMIN').exists():
            return Response(
                {"detail": "Solo los administradores pueden invitar miembros."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = InviteMemberSerializer(data=request.data)
        if serializer.is_valid():
            # Crear la invitación
            invitation_data = {
                'team': team,
                'created_by': request.user,
                **serializer.validated_data
            }
            Invitation.objects.create(**invitation_data)
            
            return Response(
                {"detail": "Invitación enviada correctamente."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='leave_team')
    def leave_team(self, request, pk=None):
        """Abandonar un equipo"""
        team = self.get_object()
        
        # Verificar si el usuario es miembro del equipo
        try:
            member = TeamMember.objects.get(team=team, user=request.user)
        except TeamMember.DoesNotExist:
            return Response(
                {"detail": "No eres miembro de este equipo."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si el usuario es el único administrador
        if member.role == 'ADMIN':
            admin_count = TeamMember.objects.filter(team=team, role='ADMIN').count()
            if admin_count == 1:
                return Response(
                    {"detail": "Eres el único administrador. Debes asignar otro administrador antes de salir."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Eliminar al miembro
        member.delete()
        
        return Response(
            {"detail": "Has abandonado el equipo correctamente."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], url_path='remove_member')
    def remove_member(self, request, pk=None):
        """Eliminar a un miembro del equipo"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {"detail": "Se requiere el ID del usuario."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si el usuario es administrador del equipo
        if not TeamMember.objects.filter(team=team, user=request.user, role='ADMIN').exists():
            return Response(
                {"detail": "Solo los administradores pueden eliminar miembros."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Usar id_usuario en lugar de user_id para buscar al miembro
        try:
            member = TeamMember.objects.get(team=team, user__id_usuario=user_id)
        except TeamMember.DoesNotExist:
            return Response(
                {"detail": "El usuario no es miembro del equipo."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # No permitir eliminar a sí mismo a través de esta acción
        if member.user.id_usuario == request.user.id_usuario:
            return Response(
                {"detail": "No puedes eliminarte a ti mismo. Usa la acción 'leave_team'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Eliminar al miembro
        member.delete()
        
        return Response(
            {"detail": "Miembro eliminado correctamente."},
            status=status.HTTP_200_OK
        )



class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Por defecto, solo mostrar invitaciones creadas por el usuario actual
        if self.action == 'list':
            return Invitation.objects.filter(created_by=self.request.user)
        return super().get_queryset()
    
    @action(detail=False, methods=['get'], url_path='my_invitations')
    def my_invitations(self, request):
        """Obtener todas las invitaciones del usuario"""
        # Buscar invitaciones por email o teléfono
        invitations = Invitation.objects.filter(
            Q(email=request.user.email) | Q(phone=request.user.phone),
            status='PENDING'
        )
        
        serializer = self.get_serializer(invitations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='accept')
    def accept_invitation(self, request, pk=None):
        """Aceptar una invitación"""
        invitation = self.get_object()
        
        # Verificar que la invitación sea para el usuario actual
        if (invitation.email != request.user.email and 
            invitation.phone != request.user.phone):
            return Response(
                {"detail": "Esta invitación no está dirigida a ti."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que la invitación esté pendiente
        if invitation.status != 'PENDING':
            return Response(
                {"detail": "Esta invitación ya ha sido procesada."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar estado de la invitación
        invitation.status = 'ACCEPTED'
        invitation.save()
        
        # Crear miembro del equipo
        TeamMember.objects.create(
            team=invitation.team,
            user=request.user,
            role='MEMBER'
        )
        
        return Response(
            {"detail": "Invitación aceptada correctamente."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='reject')
    def reject_invitation(self, request, pk=None):
        """Rechazar una invitación"""
        invitation = self.get_object()
        
        # Verificar que la invitación sea para el usuario actual
        if (invitation.email != request.user.email and 
            invitation.phone != request.user.phone):
            return Response(
                {"detail": "Esta invitación no está dirigida a ti."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que la invitación esté pendiente
        if invitation.status != 'PENDING':
            return Response(
                {"detail": "Esta invitación ya ha sido procesada."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar estado de la invitación
        invitation.status = 'REJECTED'
        invitation.save()
        
        return Response(
            {"detail": "Invitación rechazada correctamente."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'], url_path='invite')
    def create_invitation(self, request):
        """Crear una nueva invitación"""
        team_id = request.data.get('team_id')
        
        if not team_id:
            return Response(
                {"detail": "Se requiere el ID del equipo."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si el usuario es administrador del equipo
        if not TeamMember.objects.filter(team_id=team_id, user=request.user, role='ADMIN').exists():
            return Response(
                {"detail": "Solo los administradores pueden invitar miembros."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = InviteMemberSerializer(data=request.data)
        if serializer.is_valid():
            # Crear la invitación
            team = Team.objects.get(id=team_id)
            
            invitation_data = {
                'team': team,
                'created_by': request.user,
                **serializer.validated_data
            }
            invitation = Invitation.objects.create(**invitation_data)
            
            invitation_serializer = self.get_serializer(invitation)
            return Response(
                invitation_serializer.data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)