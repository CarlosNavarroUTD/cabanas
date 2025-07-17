// CreateTaskDialog.tsx (Versión Corregida)
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { TaskFormData, Team, TeamMember, NewTask } from '@/types/tasksTypes';
import TaskFormFields from './TaskFormFields';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  members: Record<number, TeamMember[]>;
  getTeamMembers: (teamId: number) => void;
  createTask: (task: NewTask) => Promise<void>; 
  fetchTasks: () => void;
  filters: { team: string };
}

export default function CreateTaskDialog({
  isOpen,
  onOpenChange,
  teams,
  members,
  getTeamMembers,
  createTask,
  fetchTasks,
  filters
}: CreateTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  // CORRECCIÓN 1: Usar undefined inicialmente, pero manejar correctamente
  const getInitialTask = (): TaskFormData => ({
    title: '',
    description: undefined,
    status: 'TODO',
    due_date: undefined,
    team: undefined, // Mantener undefined para indicar "no seleccionado"
    assigned_to: undefined
  });

  const [task, setTask] = useState<TaskFormData>(getInitialTask());

  // CORRECCIÓN 2: Mejorar la lógica de preselección de equipo
  useEffect(() => {
    if (isOpen && filters.team !== 'all') {
      const selectedTeamId = parseInt(filters.team);
      if (!isNaN(selectedTeamId) && selectedTeamId > 0) {
        setTask(prev => ({ 
          ...prev, 
          team: selectedTeamId,
          assigned_to: undefined // Limpiar asignado al cambiar equipo
        }));
        
        // Cargar miembros del equipo si no están cargados
        if (!members[selectedTeamId]) {
          getTeamMembers(selectedTeamId);
        }
      }
    }
  }, [isOpen, filters.team, getTeamMembers, members]);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setShowValidationErrors(false);
    }
  }, [isOpen]);

  const resetForm = () => {
    setTask(getInitialTask());
  };

  // CORRECCIÓN 3: Mejorar validación
  const validateForm = (): boolean => {
    if (!task.title?.trim()) {
      toast({
        title: "Error de validación",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    // CORRECCIÓN: Validar que team sea un número válido (no undefined)
    if (task.team === undefined || task.team <= 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un equipo válido",
        variant: "destructive",
      });
      return false;
    }

    // Validar que el equipo seleccionado existe
    if (!teams.find(t => t.id === task.team)) {
      toast({
        title: "Error de validación",
        description: "El equipo seleccionado no es válido",
        variant: "destructive",
      });
      return false;
    }

    // CORRECCIÓN 4: Validar usuario asignado con mejor lógica
    if (task.assigned_to && task.team) {
      const teamMembers = members[task.team];
      
      // Verificar que los miembros estén cargados
      if (!teamMembers) {
        toast({
          title: "Error de validación",
          description: "Los miembros del equipo no están cargados. Intente nuevamente.",
          variant: "destructive",
        });
        // Cargar miembros automáticamente
        getTeamMembers(task.team);
        return false;
      }

      // Verificar que el usuario asignado sea miembro del equipo
      if (!teamMembers.find(m => m.user.id_usuario === task.assigned_to)) {
        toast({
          title: "Error de validación",
          description: "El usuario asignado no es miembro del equipo seleccionado",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validar fecha límite
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        toast({
          title: "Error de validación",
          description: "La fecha límite no puede ser anterior a hoy",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowValidationErrors(true);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // CORRECCIÓN 5: Mejorar transformación de datos con type assertion segura
      const newTaskData: NewTask = {
        title: task.title.trim(), // Asegurar que no hay espacios extra
        description: task.description?.trim() || undefined,
        team: task.team!, // Usar non-null assertion ya que validamos que no es undefined
        status: task.status,
        due_date: task.due_date || undefined,
        assigned_to_id: task.assigned_to || undefined
      };

      console.log('=== DEBUG CREAR TAREA ===');
      console.log('Estado del formulario completo:', task);
      console.log('assigned_to en el estado:', task.assigned_to, typeof task.assigned_to);
      console.log('Datos que se enviarán:', newTaskData);
      console.log('assigned_to en newTaskData:', newTaskData.assigned_to_id, typeof newTaskData.assigned_to_id);
      
      if (task.team) {
        console.log('Miembros del equipo:', members[task.team]);
        console.log('¿El usuario asignado está en los miembros?:', 
          task.assigned_to ? members[task.team]?.find(m => m.user.id_usuario === task.assigned_to) : 'No hay usuario asignado');
      }
      console.log('========================');

      await createTask(newTaskData);

      // Éxito
      onOpenChange(false);
      resetForm();
      setShowValidationErrors(false);
      await fetchTasks();

      toast({
        title: "¡Éxito!",
        description: "Tarea creada correctamente",
      });

    } catch (error: unknown) {
      console.error('Error creating task:', error);
      
      let errorMessage = "Error inesperado al crear la tarea";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (error.message.includes('No eres miembro de este equipo')) {
          errorMessage = "No tienes permisos para crear tareas en este equipo";
        } else if (error.message.includes('Usuario asignado no es miembro')) {
          errorMessage = "El usuario asignado no pertenece al equipo seleccionado";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nueva tarea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <TaskFormFields
            task={task}
            setTask={setTask}
            teams={teams}
            members={members}
            getTeamMembers={getTeamMembers}
            isSubmitting={isSubmitting}
            submitLabel="Crear tarea"
            submittingLabel="Creando..."
            isEditing={false}
            showValidationErrors={showValidationErrors}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}