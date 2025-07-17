from django.contrib import admin
from .models import Team, TeamMember, Invitation

class TeamMemberInline(admin.TabularInline):
    model = TeamMember
    extra = 0

class InvitationInline(admin.TabularInline):
    model = Invitation
    extra = 0

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)
    inlines = [TeamMemberInline, InvitationInline]

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'user', 'role', 'joined_at')
    list_filter = ('role',)
    search_fields = ('team__name', 'user__email')

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'email', 'phone', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('team__name', 'email', 'phone')