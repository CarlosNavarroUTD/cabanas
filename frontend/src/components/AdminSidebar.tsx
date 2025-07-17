'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/useTeams';
import {
  Home,
  Calendar,
  Users,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Building
} from 'lucide-react';

interface Team {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface AdminSidebarProps {
  currentTeamId?: number;
  onTeamChange?: (teamId: number) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ 
  currentTeamId,
  onTeamChange,
  onLogout 
}: AdminSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const router = useRouter();
  
  const { teams, fetchTeams, isLoading } = useTeams();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Función para generar iniciales del nombre del equipo
  const getTeamInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Obtener el equipo actual
  const currentTeam = teams.find(team => team.id === currentTeamId) || teams[0];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleTeamChange = (teamId: number) => {
    onTeamChange?.(teamId);
    setIsTeamDropdownOpen(false);
  };

  const menuItems = [
    { icon: Building, label: 'Cabañas', path: '/app/cabanas' },
    { icon: Calendar, label: 'Reservas', path: '/app/reservas' },
    { icon: Users, label: 'Clientes', path: '/app/clientes' },
    { icon: MessageSquare, label: 'Reseñas', path: '/app/resenas' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setIsTeamDropdownOpen(false);
      }}
    >
      <div className="flex flex-col h-full pt-16">
        {/* Selector de equipo */}
        <div className="px-3 py-4 border-b border-gray-200">
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                {isExpanded && (
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                )}
              </div>
            ) : currentTeam ? (
              <button
                onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {getTeamInitials(currentTeam.name)}
                </div>
                {isExpanded && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {currentTeam.name}
                      </p>
                      <p className="text-xs text-gray-500">Equipo actual</p>
                    </div>
                    {teams.length > 1 && (
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                        isTeamDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    )}
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                  ?
                </div>
                {isExpanded && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-500">
                      Sin equipos
                    </p>
                    <p className="text-xs text-gray-400">No hay equipos disponibles</p>
                  </div>
                )}
              </div>
            )}

            {/* Dropdown de equipos */}
            {isTeamDropdownOpen && isExpanded && teams.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamChange(team.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 transition-colors ${
                      team.id === currentTeam?.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-white font-semibold text-xs ${
                      team.id === currentTeam?.id ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      {getTeamInitials(team.name)}
                    </div>
                    <div className="flex-1 text-left">
                      <span className={`text-sm ${
                        team.id === currentTeam?.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}>
                        {team.name}
                      </span>
                      {team.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {team.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Elementos del menú principal */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <item.icon className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
              {isExpanded && (
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Elementos del footer */}
        <div className="px-3 py-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => handleNavigate('/app/perfil')}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <User className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            {isExpanded && (
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Perfil
              </span>
            )}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
            {isExpanded && (
              <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                Cerrar Sesión
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}