'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useTeams } from '@/hooks/useTeams';
import { Task } from '@/types/tasksTypes';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import CreateTaskDialog from './CreateTaskDialog';
import EditTaskDialog from './EditTaskDialog';

// Usar el tipo Member del store directamente
interface Member {
  id: number;
  team: number;
  user: {
    id_usuario: number;
    nombre_usuario: string;
    email: string;
    phone: string;
    persona: {
      id_persona: number;
      nombre: string;
      apellido: string;
    }
  };
  role: string; // Cambié de 'rol' a 'role' para coincidir con useTeams
  joined_at: string;
}

export default function TasksList() {
  const currentUserId = 1;
  const searchParams = useSearchParams();
  
  const { tasks, fetchTasks, createTask, deleteTask, updateTask, isLoading } = useTasks();
  const { teams, members, getTeamMembers, fetchTeams } = useTeams();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    team: searchParams.get('team') || '',
    assignedToMe: searchParams.get('assignedToMe') === 'true'
  });
  
  useEffect(() => {
    fetchTeams();
    fetchTasks();
  }, [fetchTeams, fetchTasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask({
      ...task,
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    });
    getTeamMembers(task.team);
    setIsEditDialogOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status.toString() !== filters.status) return false;
    if (filters.team && task.team.toString() !== filters.team) return false;
    if (filters.assignedToMe && (!task.assigned_to || task.assigned_to.id_usuario !== currentUserId)) return false;
    return true;
  });

  // Definir el tipo TeamMember basado en lo que esperan los componentes
  interface TeamMember {
    id: number;
    team: number;
    user: {
      id: number;
      id_usuario: number;
      nombre_usuario: string;
      email: string;
      phone: string;
      rol: string; // Mantener 'rol' para compatibilidad con componentes
      persona: {
        id_persona: number;
        nombre: string;
        apellido: string;
      }
    };
    joined_at: string;
  }

  // Función helper para transformar Member a TeamMember
  const transformMemberToTeamMember = (member: Member): TeamMember => ({
    ...member,
    user: {
      ...member.user,
      id: member.user.id_usuario, // Mapear id_usuario a id
      rol: member.role, // Mapear role a rol para compatibilidad
    }
  });

  // Función helper para obtener miembros por equipo transformados
  const getMembersByTeam = (teamId: number): TeamMember[] => {
    const teamMembers = members[teamId] || [];
    return teamMembers.map(transformMemberToTeamMember);
  };

  // Función helper para transformar todo el objeto members
  const getTransformedMembers = (): Record<number, TeamMember[]> => {
    const transformed: Record<number, TeamMember[]> = {};
    Object.keys(members).forEach(teamId => {
      const teamIdNum = parseInt(teamId);
      transformed[teamIdNum] = members[teamIdNum].map(transformMemberToTeamMember);
    });
    return transformed;
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tareas</h2>
        <CreateTaskDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          teams={teams}
          members={getTransformedMembers()} // Miembros transformados
          getTeamMembers={getTeamMembers}
          createTask={createTask}
          fetchTasks={fetchTasks}
          filters={filters}
        />
      </div>

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        teams={teams}
        members={editingTask ? { [editingTask.team]: getMembersByTeam(editingTask.team) } : {}} // Solo miembros del equipo específico
        getTeamMembers={getTeamMembers}
        updateTask={updateTask}
        fetchTasks={fetchTasks}
      />

      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        teams={teams}
        tasksCount={{ filtered: filteredTasks.length, total: tasks.length }}
      />

      <TaskTable
        tasks={filteredTasks}
        teams={teams}
        members={getTransformedMembers()} // Miembros transformados
        isLoading={isLoading}
        onEditTask={handleEditTask}
        onDeleteTask={deleteTask}
        fetchTasks={fetchTasks}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}