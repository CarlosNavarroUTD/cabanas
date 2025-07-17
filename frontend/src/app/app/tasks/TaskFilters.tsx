// TaskFilters.tsx
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Team } from '@/types/tasksTypes';

interface TaskFiltersProps {
  filters: {
    status: string;
    team: string;
    assignedToMe: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string;
    team: string;
    assignedToMe: boolean;
  }>>;
  teams: Team[];
  tasksCount: { filtered: number; total: number };
}

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'TODO', label: 'Por hacer' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'DONE', label: 'Completado' }
];

export default function TaskFilters({ filters, setFilters, teams, tasksCount }: TaskFiltersProps) {
  return (
    <div className="mb-4 flex gap-4 items-center flex-wrap">
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => setFilters(prev => ({ 
          ...prev, 
          status: value === 'all' ? '' : value 
        }))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.team ? filters.team.toString() : 'all'}
        onValueChange={(value) => setFilters(prev => ({ 
          ...prev, 
          team: value === 'all' ? '' : parseInt(value).toString() 
        }))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Equipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los equipos</SelectItem>
          {teams.map(team => (
            <SelectItem key={team.id} value={team.id.toString()}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={filters.assignedToMe ? "default" : "outline"}
        onClick={() => setFilters(prev => ({ ...prev, assignedToMe: !prev.assignedToMe }))}
      >
        Mis tareas
      </Button>

      <div className="text-sm text-gray-600">
        Mostrando {tasksCount.filtered} de {tasksCount.total} tareas
      </div>
    </div>
  );
}