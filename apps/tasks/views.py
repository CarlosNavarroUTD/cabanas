from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task, TaskComment
from .serializers import (
    TaskSerializer, 
    TaskCommentSerializer, 
    TaskUpdateSerializer,
    TaskStatusUpdateSerializer
)
from apps.teams.models import TeamMember
from django.db.models import Q
from django.utils import timezone

class IsTeamMemberOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los miembros del equipo
    modificar o eliminar tareas.
    """
    
    def has_object_permission(self, request, view, obj):
        # Permitir GET, HEAD u OPTIONS a cualquier usuario
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Verificar si el usuario es miembro del equipo
        return TeamMember.objects.filter(
            team=obj.team,
            user=request.user
        ).exists()

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return TaskUpdateSerializer
        return self.serializer_class
    
    def get_queryset(self):
        """Filtrar tareas por equipo, estado y fecha de vencimiento"""
        queryset = Task.objects.all()
        
        # Filtrar solo las tareas de los equipos del usuario
        user_teams = TeamMember.objects.filter(user=self.request.user).values_list('team_id', flat=True)
        queryset = queryset.filter(team_id__in=user_teams)
        
        # Filtrar por equipo si se especifica
        team = self.request.query_params.get('team')
        if team:
            queryset = queryset.filter(team_id=team)
        
        # Filtrar por estado si se especifica
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filtrar por fecha de vencimiento
        due_date = self.request.query_params.get('due_date')
        if due_date == 'today':
            today = timezone.now().date()
            queryset = queryset.filter(due_date=today)
        elif due_date == 'overdue':
            today = timezone.now().date()
            queryset = queryset.filter(due_date__lt=today, status__in=['TODO', 'IN_PROGRESS'])
        elif due_date == 'upcoming':
            today = timezone.now().date()
            queryset = queryset.filter(due_date__gt=today)
        
        return queryset.order_by('due_date', 'created_at')
    
    @action(detail=True, methods=['post'], url_path='change_status')
    def change_status(self, request, pk=None):
        """Cambiar el estado de una tarea"""
        task = self.get_object()
        
        serializer = TaskStatusUpdateSerializer(data=request.data)
        if serializer.is_valid():
            task.status = serializer.validated_data['status']
            task.save()
            
            return Response(TaskSerializer(task).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='add_comment')
    def add_comment(self, request, pk=None):
        """Añadir un comentario a una tarea"""
        task = self.get_object()
        
        serializer = TaskCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(task=task, user=request.user)
            
            return Response(
                TaskCommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)