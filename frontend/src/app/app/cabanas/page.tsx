// src/app/app/cabanas/page.tsx
'use client';

import CabanaAdminPage from '@/components/cabanas/CabanaAdminPage';
import { useTeamContext } from '@/contexts/TeamContext';

export default function Page() {
  const { currentTeam } = useTeamContext();

  if (!currentTeam) {
    return <div>Cargando equipo...</div>; // o spinner
  }

  return <CabanaAdminPage teamId={currentTeam.id} />;
}
