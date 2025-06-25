from django.contrib import admin
from .models import Task, TaskComment

class TaskCommentInline(admin.TabularInline):
    model = TaskComment
    extra = 0

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'team', 'created_by', 'assigned_to', 'status', 'due_date', 'created_at')
    list_filter = ('status', 'due_date', 'team')
    search_fields = ('title', 'description', 'created_by__email', 'assigned_to__email')
    inlines = [TaskCommentInline]

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('task__title', 'user__email', 'content')