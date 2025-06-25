from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Node(models.Model):
    NODE_TYPES = (
        ('page', 'Page'),
        ('text', 'Text'),
        ('heading', 'Heading'),
        ('todo', 'Todo Item'),
    )
    
    PERMISSION_TYPES = (
        ('read', 'Read Only'),
        ('edit', 'Edit'),
        ('admin', 'Admin'),
    )
    
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_nodes')
    type = models.CharField(max_length=20, choices=NODE_TYPES)
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        
    def clean(self):
        # Validar que is_completed solo se use con type='todo'
        if self.is_completed and self.type != 'todo':
            raise ValidationError({'is_completed': 'Solo los nodos de tipo "todo" pueden estar completados'})
        
        # Validar que el padre pertenezca al mismo usuario
        if self.parent and self.parent.owner_id != self.owner_id:
            raise ValidationError({'parent': 'El nodo padre debe pertenecer al mismo usuario'})
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.type}: {self.title or self.content[:30]}"


class NodePermission(models.Model):
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='node_permissions')
    permission = models.CharField(max_length=10, choices=Node.PERMISSION_TYPES, default='read')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('node', 'user')
    
    def __str__(self):
        return f"{self.user} - {self.permission} - {self.node}"


class TeamNodePermission(models.Model):
    """Permisos para equipos (para la funcionalidad extra)"""
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='team_permissions')
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='node_permissions')
    permission = models.CharField(max_length=10, choices=Node.PERMISSION_TYPES, default='read')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('node', 'team')
    
    def __str__(self):
        return f"{self.team} - {self.permission} - {self.node}"