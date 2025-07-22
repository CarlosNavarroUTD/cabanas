'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Users, Mail, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AddTeamForm from '@/components/teams/AddTeamForm';

export default function TeamsList() {
  const router = useRouter();
  const { 
    teams, 
    invitations, 
    fetchTeams, 
    fetchInvitations, 
    createTeam, 
    inviteMember, 
    acceptInvitation, 
    rejectInvitation,
    isLoading 
  } = useTeams();
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone'>('email');

  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, [fetchTeams, fetchInvitations]);

  const handleCreateTeam = async (teamData: { name: string; description: string }) => {
    await createTeam(teamData);
  };

  const handleInviteMember = async (teamId: number) => {
    try {
      if (inviteMethod === 'email') {
        if (!inviteEmail) {
          toast({
            title: "Error",
            description: "El email es obligatorio",
            variant: "destructive",
          });
          return;
        }
        await inviteMember(teamId, { email: inviteEmail });
        setInviteEmail('');
      } else {
        if (!invitePhone) {
          toast({
            title: "Error",
            description: "El teléfono es obligatorio",
            variant: "destructive",
          });
          return;
        }
        await inviteMember(teamId, { phone: invitePhone });
        setInvitePhone('');
      }
      
      toast({
        title: "Éxito",
        description: "Invitación enviada correctamente",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Error al enviar la invitación";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      await acceptInvitation(invitationId);
      toast({
        title: "Éxito",
        description: "Invitación aceptada correctamente",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Error al aceptar la invitación";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRejectInvitation = async (invitationId: number) => {
    try {
      await rejectInvitation(invitationId);
      toast({
        title: "Éxito",
        description: "Invitación rechazada correctamente",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Error al rechazar la invitación";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const viewTeamMembers = (teamId: number) => {
    router.push(`teams/members/${teamId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Equipos</h2>
        <AddTeamForm onCreateTeam={handleCreateTeam} isLoading={isLoading} />
      </div>

      {/* Sección de invitaciones pendientes */}
      {invitations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Invitaciones Pendientes</h3>
          <table className="w-full border-collapse border border-red-300">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-red-300 p-2">Equipo</th>
                <th className="border border-red-300 p-2">Descripción</th>
                <th className="border border-red-300 p-2">Invitado por</th>
                <th className="border border-red-300 p-2">Fecha</th>
                <th className="border border-red-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="text-center bg-red-50 bg-opacity-30">
                  <td className="border border-red-300 p-2">{invitation.team.name}</td>
                  <td className="border border-red-300 p-2">{invitation.team.description || '-'}</td>
                  <td className="border border-red-300 p-2">{invitation.created_by.nombre_usuario}</td>
                  <td className="border border-red-300 p-2">{formatDate(invitation.created_at)}</td>
                  <td className="border border-red-300 p-2">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-600 hover:bg-green-100 border-green-300"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-300"
                        onClick={() => handleRejectInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sección de equipos */}
      <h3 className="text-xl font-semibold mb-4">Equipos Activos</h3>
      {isLoading ? (
        <p>Cargando equipos...</p>
      ) : teams.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="text-center">
                <td className="border p-2">{team.name}</td>
                <td className="border p-2">{team.description || '-'}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewTeamMembers(team.id)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Integrantes
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTeamId(team.id)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Invitar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invitar miembro al equipo</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="email" onValueChange={(v) => setInviteMethod(v as 'email' | 'phone')}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Teléfono</TabsTrigger>
                          </TabsList>
                          <TabsContent value="email">
                            <div className="flex flex-col gap-4">
                              <Input
                                type="email"
                                placeholder="Email del nuevo integrante"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                              />
                            </div>
                          </TabsContent>
                          <TabsContent value="phone">
                            <div className="flex flex-col gap-4">
                              <Input
                                type="tel"
                                placeholder="Teléfono del nuevo integrante"
                                value={invitePhone}
                                onChange={(e) => setInvitePhone(e.target.value)}
                              />
                            </div>
                          </TabsContent>
                          <Button 
                            className="mt-4"
                            onClick={() => selectedTeamId && handleInviteMember(selectedTeamId)}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Enviando...' : 'Enviar invitación'}
                          </Button>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes equipos aún.</p>
      )}
    </div>
  );
}