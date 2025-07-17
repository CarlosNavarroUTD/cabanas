// src/services/teams.service.ts
import api from '@/lib/api';

interface TeamData {
  name: string;
  description?: string;
}

interface InviteMemberData {
  email?: string;
  phone?: string;
}

export const teamsService = {
  async getMyTeams() {
    const response = await api.get('/teams/teams/my_teams/');
    return response.data;
  },

  async createTeam(data: TeamData) {
    const response = await api.post('/teams/teams/', data);
    return response.data;
  },

  async getTeamMembers(teamId: number) {
    const response = await api.get(`/teams/teams/${teamId}/members/`);
    return response.data;
  },

  async inviteMember(teamId: number, data: InviteMemberData) {
    const response = await api.post(`/teams/teams/${teamId}/invite_member/`, data);
    return response.data;
  },

  async leaveTeam(teamId: number) {
    const response = await api.post(`/teams/teams/${teamId}/leave_team/`);
    return response.data;
  },

  async removeMember(teamId: number, userId: number) {
    const response = await api.post(`/teams/teams/${teamId}/remove_member/`, {
      user_id: userId
    });
    return response.data;
  },
  
  async getMyInvitations() {
    const response = await api.get('/teams/invitations/my_invitations/');
    return response.data;
  },

  async acceptInvitation(invitationId: number) {
    const response = await api.post(`/teams/invitations/${invitationId}/accept/`);
    return response.data;
  },

  async rejectInvitation(invitationId: number) {
    const response = await api.post(`/teams/invitations/${invitationId}/reject/`);
    return response.data;
  }
};