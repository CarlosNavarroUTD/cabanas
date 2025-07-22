// src/app/app/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TeamProvider, useTeamContext } from '@/contexts/TeamContext';
import { useAuth } from '@/hooks/useAuth';
import { useTeams } from '@/hooks/useTeams';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import AddTeamForm from '@/components/teams/AddTeamForm';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeamProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </TeamProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentTeam, teams, isLoading: isTeamsLoading, setCurrentTeam } = useTeamContext();
  const { user, isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuth();
  const { createTeam, isLoading: isCreatingTeam } = useTeams();

  // 🔒 Verifica autenticación y permisos
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

    // No autenticado
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Validar rol y permisos
    const rol = user?.rol;
    const isCliente = rol === 'cliente';

    if (isCliente ) {
      router.replace('/perfil');
    }

    // Arrendador tiene acceso completo
  }, [isAuthenticated, isAuthLoading, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentTeamId');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleTeamChange = (teamId: number) => {
    const selectedTeam = teams.find((team) => team.id === teamId);
    if (selectedTeam) {
      setCurrentTeam(selectedTeam);
      console.log('Equipo cambiado a:', selectedTeam.name);
    }
  };

  const handleCreateTeam = async (teamData: { name: string; description: string }) => {
    try {
      await createTeam(teamData);
      // El contexto se actualizará automáticamente con el nuevo equipo
      // y se mostrará el dashboard normal
    } catch (error) {
      console.error('Error al crear equipo:', error);
      // El error ya se maneja en el componente AddTeamForm
    }
  };

  if (isAuthLoading || (isTeamsLoading && teams.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isTeamsLoading && teams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ¡Bienvenido! 👋
            </h2>
            <p className="text-gray-600 mb-6">
              Para comenzar, necesitas crear tu primer equipo de trabajo.
            </p>
            
            <div className="mb-6">
              <AddTeamForm 
                onCreateTeam={handleCreateTeam} 
                isLoading={isCreatingTeam}
              />
            </div>

            <div className="text-sm text-gray-500">
              <p>¿Ya tienes un equipo?</p>
              <button
                onClick={() => router.push('/app/teams')}
                className="text-blue-600 hover:text-blue-700 underline mt-1"
              >
                Ver invitaciones pendientes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <AdminSidebar
        currentTeamId={currentTeam?.id}
        onTeamChange={handleTeamChange}
        onLogout={handleLogout}
      />
      <main className="ml-16 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}