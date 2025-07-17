'use client';

import { useRouter } from 'next/navigation';
import { useTeamContext } from '@/contexts/TeamContext';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentTeam, teams, isLoading, setCurrentTeam, refreshTeams } = useTeamContext();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentTeamId');
    router.push('/login');
  };

  const handleTeamChange = (teamId: number) => {
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      setCurrentTeam(selectedTeam);
      console.log('Equipo cambiado a:', selectedTeam.name);
    }
  };

  // Mostrar loading mientras se cargan los equipos
  if (isLoading && teams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay equipos
  if (!isLoading && teams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No hay equipos disponibles
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas ser parte de un equipo para acceder al dashboard.
            </p>
            <button
              onClick={() => router.push('/teams/create')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear un equipo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <AdminNavbar />
      
      {/* Sidebar */}
      <AdminSidebar
        currentTeamId={currentTeam?.id}
        onTeamChange={handleTeamChange}
        onLogout={handleLogout}
      />
      
      {/* Contenido principal */}
      <main className="ml-16 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}