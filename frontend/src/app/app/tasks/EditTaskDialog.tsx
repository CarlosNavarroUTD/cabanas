// EditTaskDialog.tsx (Corregido)
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Task, Team, TeamMember, TaskFormData, UpdateTask } from '@/types/tasksTypes';
import TaskFormFields from './TaskFormFields';

interface EditTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  teams: Team[];
  members: Record<number, TeamMember[]>;
  getTeamMembers: (teamId: number) => void;
  updateTask: (taskId: number, task: UpdateTask) => Promise<void>; // Usar UpdateTask
  fetchTasks: () => void;
}

export default function EditTaskDialog({
  isOpen,
  onOpenChange,
  editingTask,
  setEditingTask,
  teams,
  members,
  getTeamMembers,
  updateTask,
  fetchTasks
}: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado local del formulario basado en TaskFormData
  const [task, setTask] = useState<TaskFormData>({
    title: '',
    description: undefined,
    status: 'TODO',
    due_date: undefined,
    team: 0, // Inicializar con 0 en lugar de undefined
    assigned_to: undefined
  });

  // Sincronizar estado del formulario cuando cambia editingTask
  useEffect(() => {
    if (editingTask) {
      // Extraer assigned_to ID si es un objeto User
      const assignedToId = typeof editingTask.assigned_to === 'object' 
        ? editingTask.assigned_to?.id_usuario 
        : editingTask.assigned_to;

      setTask({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        due_date: editingTask.due_date,
        team: editingTask.team,
        assigned_to: assignedToId
      });

      // Cargar miembros del equipo
      if (editingTask.team && !members[editingTask.team]) {
        getTeamMembers(editingTask.team);
      }
    }
  }, [editingTask, getTeamMembers, members]);

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTask({
        title: '',
        description: undefined,
        status: 'TODO',
        due_date: undefined,
        team: 0,
        assigned_to: undefined
      });
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    if (!task.title?.trim()) {
      toast({
        title: "Error de validación",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!task.team || task.team === 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un equipo",
        variant: "destructive",
      });
      return false;
    }

    // Validar que el usuario asignado sea miembro del equipo
    if (task.assigned_to && task.team) {
      const teamMembers = members[task.team];
      if (teamMembers && !teamMembers.find(m => m.user.id_usuario === task.assigned_to)) {
        toast({
          title: "Error de validación",
          description: "El usuario asignado no es miembro del equipo seleccionado",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTask || !validateForm()) return;

    try {
      setIsSubmitting(true);

      // Transformar TaskFormData a UpdateTask (solo campos que se pueden actualizar)
      const updateData: UpdateTask = {
        title: task.title,
        description: task.description || undefined,
        status: task.status,
        due_date: task.due_date || undefined,
        assigned_to_id: task.assigned_to || undefined
      };

      console.log('Actualizando tarea con datos:', updateData);

      await updateTask(editingTask.id, updateData);

      // Éxito: cerrar diálogo y limpiar estado
      onOpenChange(false);
      setEditingTask(null);
      await fetchTasks();

      toast({
        title: "¡Éxito!",
        description: "Tarea actualizada correctamente",
      });

    } catch (error: unknown) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Error al actualizar la tarea: ${error.message}`
          : "Error inesperado al actualizar la tarea",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // No renderizar si no hay tarea para editar
  if (!editingTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <TaskFormFields
            task={task}
            setTask={setTask}
            teams={teams}
            members={members}
            getTeamMembers={getTeamMembers}
            isSubmitting={isSubmitting}
            submitLabel="Actualizar tarea"
            submittingLabel="Actualizando..."
            isEditing={true}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}