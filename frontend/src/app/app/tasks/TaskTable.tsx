// TaskTable.tsx (Versión con Debug Mejorado para assigned_to)
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Task, Team, TeamMember } from '@/types/tasksTypes';

interface TaskTableProps {
  tasks: Task[];
  teams: Team[];
  members: Record<number, TeamMember[]>;
  isLoading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => Promise<void>;
  fetchTasks: () => void;
  filters: { status: string; team: string; assignedToMe: boolean };
  setFilters: React.Dispatch<React.SetStateAction<{ status: string; team: string; assignedToMe: boolean }>>;
  getTeamMembers?: (teamId: number) => void;
}

export default function TaskTable({ 
  tasks, 
  teams, 
  members, 
  isLoading, 
  onEditTask, 
  onDeleteTask, 
  fetchTasks,
  filters,
  setFilters,
  getTeamMembers
}: TaskTableProps) {

  // DEBUG: Mostrar todas las tareas al inicio
  React.useEffect(() => {
    console.log('📋 TODAS LAS TAREAS EN LA TABLA:');
    tasks.forEach((task, index) => {
      console.log(`📋 Tarea ${index + 1}:`, {
        id: task.id,
        title: task.title,
        team: task.team,
        assigned_to: task.assigned_to,
        assigned_to_type: typeof task.assigned_to
      });
    });
  }, [tasks]);

  React.useEffect(() => {
    if (getTeamMembers && typeof getTeamMembers === 'function') {
      const uniqueTeams = [...new Set(tasks.map(task => task.team))];
      uniqueTeams.forEach(teamId => {
        if (teamId && !members[teamId]) {
          console.log(`Cargando miembros del equipo ${teamId}`);
          getTeamMembers(teamId);
        }
      });
    }
  }, [tasks, getTeamMembers, members]);
  
  // Función mejorada con debug detallado
  const getAssignedUserName = (task: Task) => {
    console.log(`🔍 DEBUG ASIGNACIÓN - Tarea: ${task.title}`);
    console.log(`🔍 assigned_to raw:`, task.assigned_to);
    console.log(`🔍 Tipo de assigned_to:`, typeof task.assigned_to);
    console.log(`🔍 Equipo de la tarea:`, task.team);
    console.log(`🔍 ¿assigned_to es truthy?:`, !!task.assigned_to);
    console.log(`🔍 ¿assigned_to === 0?:`, typeof task.assigned_to === 'number' && task.assigned_to === 0);
    console.log(`🔍 ¿assigned_to === null?:`, task.assigned_to === null);
    console.log(`🔍 ¿assigned_to === undefined?:`, task.assigned_to === undefined);
    
    if (!task.assigned_to) {
      console.log(`🔍 ❌ PROBLEMA: assigned_to es falsy, pero debería ser 9`);
      console.log(`🔍 ❌ Esto indica que los datos de la tarea no tienen assigned_to`);
      return 'Sin asignar';
    }
    
    // Si assigned_to ya es un objeto User completo (del serializer)
    if (typeof task.assigned_to === 'object' && task.assigned_to.id_usuario) {
      console.log(`🔍 ✅ assigned_to es objeto User:`, task.assigned_to);
      const user = task.assigned_to;
      const name = user.persona 
        ? `${user.persona.nombre} ${user.persona.apellido}`
        : user.nombre_usuario;
      console.log(`🔍 ✅ Nombre del usuario:`, name);
      return name;
    }
    
    // Si assigned_to es un ID, buscar en los miembros del equipo
    const assignedUserId = typeof task.assigned_to === 'number' 
      ? task.assigned_to 
      : (task.assigned_to as { id_usuario?: number })?.id_usuario;
    
    console.log(`🔍 ID de usuario a buscar:`, assignedUserId);
    
    const teamMembers = members[task.team];
    console.log(`🔍 Miembros del equipo ${task.team}:`, teamMembers);
    
    if (!teamMembers) {
      console.log(`🔍 ⚠️ No hay miembros cargados para el equipo ${task.team}`);
      if (getTeamMembers && typeof getTeamMembers === 'function') {
        getTeamMembers(task.team);
        return 'Cargando...';
      }
      return 'Miembros no disponibles';
    }
    
    console.log(`🔍 IDs de miembros disponibles:`, teamMembers.map(m => m.user.id_usuario));
    
    const member = teamMembers.find(m => m.user.id_usuario === assignedUserId);
    console.log(`🔍 Miembro encontrado:`, member);
    
    if (!member) {
      console.log(`🔍 ❌ Usuario con ID ${assignedUserId} no encontrado en el equipo ${task.team}`);
      console.log(`🔍 ❌ POSIBLE PROBLEMA: El usuario asignado no pertenece al equipo actual`);
      
      // Buscar el usuario en TODOS los equipos para debug
      console.log(`🔍 🔎 Buscando usuario ${assignedUserId} en todos los equipos...`);
      Object.entries(members).forEach(([teamId, teamMembers]) => {
        const found = teamMembers.find(m => m.user.id_usuario === assignedUserId);
        if (found) {
          console.log(`🔍 🎯 Usuario ${assignedUserId} encontrado en equipo ${teamId}:`, found.user);
        }
      });
      
      return `Usuario no encontrado (ID: ${assignedUserId})`;
    }
    
    const name = member.user.persona 
      ? `${member.user.persona.nombre} ${member.user.persona.apellido}`
      : member.user.nombre_usuario;
    
    console.log(`🔍 ✅ Nombre final:`, name);
    return name;
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      'TODO': 'Por hacer',
      'IN_PROGRESS': 'En progreso',
      'DONE': 'Completado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await onDeleteTask(taskId);
      await fetchTasks();
      
      toast({
        title: "Éxito",
        description: "Tarea eliminada correctamente",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar la tarea",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'DONE';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Cargando tareas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay tareas que coincidan con los filtros seleccionados.</p>
        {(filters.status !== 'all' || filters.team !== 'all' || filters.assignedToMe) && (
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => setFilters({ status: 'all', team: 'all', assignedToMe: false })}
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Título</th>
            <th className="border p-3 text-left">Descripción</th>
            <th className="border p-3 text-center">Estado</th>
            <th className="border p-3 text-center">Equipo</th>
            <th className="border p-3 text-center">Asignado a</th>
            <th className="border p-3 text-center">Fecha límite</th>
            <th className="border p-3 text-center">Creado por</th>
            <th className="border p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="border p-3 font-medium">{task.title}</td>
              <td className="border p-3 max-w-xs">
                <div className="truncate" title={task.description || ''}>
                  {task.description || 'Sin descripción'}
                </div>
              </td>
              <td className="border p-3 text-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </td>
              <td className="border p-3 text-center">
                {teams.find(team => team.id === task.team)?.name || 'Equipo desconocido'}
              </td>
              <td className="border p-3 text-center">
                {getAssignedUserName(task)}
              </td>
              <td className="border p-3 text-center">
                {task.due_date ? (
                  <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.due_date)}
                  </span>
                ) : (
                  <span className="text-gray-400">Sin fecha</span>
                )}
              </td>
              <td className="border p-3 text-center">
                {task.created_by ? (
                  task.created_by.persona 
                    ? `${task.created_by.persona.nombre} ${task.created_by.persona.apellido}`
                    : task.created_by.nombre_usuario
                ) : (
                  'Desconocido'
                )}
              </td>
              <td className="border p-3">
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditTask(task)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La tarea &quot;{task.title}&quot; será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}