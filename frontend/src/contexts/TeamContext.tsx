// src/contexts/TeamContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTeams } from '@/hooks/useTeams';

interface Team {
  id: number;
  name: string;
  description?: string;
}

interface TeamContextType {
  currentTeam: Team | null;
  teams: Team[];
  isLoading: boolean;
  setCurrentTeam: (team: Team) => void;
  refreshTeams: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { teams, fetchTeams, isLoading } = useTeams();
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Establecer el equipo actual cuando los equipos se cargan
  useEffect(() => {
    if (teams.length > 0 && !currentTeam) {
      const savedTeamId = localStorage.getItem('currentTeamId');
      if (savedTeamId) {
        const teamExists = teams.find(team => team.id === parseInt(savedTeamId));
        if (teamExists) {
          setCurrentTeamState(teamExists);
        } else {
          setCurrentTeamState(teams[0]);
        }
      } else {
        setCurrentTeamState(teams[0]);
      }
    }
  }, [teams, currentTeam]);

  const setCurrentTeam = (team: Team) => {
    setCurrentTeamState(team);
    localStorage.setItem('currentTeamId', team.id.toString());
  };

  const refreshTeams = () => {
    fetchTeams();
  };

  return (
    <TeamContext.Provider value={{
      currentTeam,
      teams,
      isLoading,
      setCurrentTeam,
      refreshTeams
    }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeamContext() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
}