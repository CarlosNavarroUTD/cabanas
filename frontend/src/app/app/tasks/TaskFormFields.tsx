// TaskFormFields.tsx (Versión con Debug Mejorado)
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFormFieldsProps } from '@/types/tasksTypes';

const statusOptions = [
  { value: 'TODO', label: 'Por hacer' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'DONE', label: 'Completado' }
] as const;

interface ExtendedTaskFormFieldsProps extends TaskFormFieldsProps {
  showValidationErrors?: boolean;
}

export default function TaskFormFields({
  task,
  setTask,
  teams,
  members,
  getTeamMembers,
  isSubmitting,
  submitLabel,
  submittingLabel,
  showValidationErrors = false
}: ExtendedTaskFormFieldsProps) {
  
  // Obtener el ID del equipo de manera unificada
  const getCurrentTeamId = (): number | undefined => {
    return task.team && task.team > 0 ? task.team : undefined;
  };

  const teamId = getCurrentTeamId();
  const teamUsers = teamId ? members[teamId] || [] : [];

  /**
   * Maneja la selección de equipo
   * Limpia la asignación cuando se cambia de equipo
   */
  const handleTeamSelect = (value: string) => {
    const selectedTeamId = parseInt(value);
    console.log('🔄 Seleccionando equipo:', selectedTeamId);
    
    setTask(prev => ({ 
      ...prev, 
      team: selectedTeamId, 
      assigned_to: undefined 
    }));
    
    // Cargar miembros del nuevo equipo
    getTeamMembers(selectedTeamId);
  };

  /**
   * Maneja la asignación de usuario - VERSIÓN MEJORADA
   */
  const handleAssignedToSelect = (value: string) => {
    console.log('👤 Seleccionando usuario, valor recibido:', value, typeof value);
    
    let assignedUserId: number | undefined;
    
    if (value === 'unassigned' || value === '') {
      assignedUserId = undefined;
      console.log('👤 Sin asignar');
    } else {
      const parsedId = parseInt(value);
      if (isNaN(parsedId)) {
        console.error('❌ Error al parsear ID de usuario:', value);
        assignedUserId = undefined;
      } else {
        assignedUserId = parsedId;
        console.log('👤 Usuario asignado ID:', assignedUserId);
      }
    }
    
    setTask(prev => {
      const newTask = { ...prev, assigned_to: assignedUserId };
      console.log('👤 Nuevo estado después de asignación:', newTask);
      return newTask;
    });
  };

  /**
   * Validación de fecha - debe ser futura
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (!selectedDate || selectedDate >= today) {
      setTask(prev => ({ ...prev, due_date: selectedDate || undefined }));
    }
  };

  // Cargar miembros del equipo al montar el componente
  useEffect(() => {
    if (teamId) {
      console.log('📥 Cargando miembros para equipo:', teamId);
      getTeamMembers(teamId);
    }
  }, [teamId, getTeamMembers]);

  // Debug: Mostrar estado actual
  useEffect(() => {
    console.log('🔍 Estado actual del formulario:', {
      title: task.title,
      team: task.team,
      assigned_to: task.assigned_to,
      teamUsers: teamUsers.length
    });
  }, [task, teamUsers]);

  /**
   * Obtener el valor para el select de asignación
   */
  const getAssignedToValue = (): string => {
    const value = task.assigned_to ? task.assigned_to.toString() : 'unassigned';
    console.log('📄 Valor para select de asignación:', value, 'task.assigned_to:', task.assigned_to);
    return value;
  };

  /**
   * Obtener el valor para el select de equipo
   */
  const getTeamSelectValue = (): string => {
    const currentTeamId = getCurrentTeamId();
    return currentTeamId ? currentTeamId.toString() : '';
  };

  /**
   * Validar si el formulario está completo
   */
  const isFormValid = (): boolean => {
    return !!(task.title?.trim() && getCurrentTeamId());
  };

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div>
        <Input
          placeholder="Título de la tarea *"
          value={task.title || ''}
          onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        {showValidationErrors && !task.title?.trim() && (
          <p className="text-sm text-red-500 mt-1">El título es requerido</p>
        )}
      </div>

      <Textarea
        placeholder="Descripción (opcional)"
        value={task.description || ''}
        onChange={(e) => setTask(prev => ({ 
          ...prev, 
          description: e.target.value || undefined 
        }))}
        rows={3}
      />

      <Select
        value={task.status}
        onValueChange={(value) => setTask(prev => ({ 
          ...prev, 
          status: value as 'TODO' | 'IN_PROGRESS' | 'DONE' 
        }))}
      >
        <SelectTrigger>
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

      <div>
        <Select
          value={getTeamSelectValue()}
          onValueChange={handleTeamSelect}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar equipo *" />
          </SelectTrigger>
          <SelectContent>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showValidationErrors && !getCurrentTeamId() && (
          <p className="text-sm text-red-500 mt-1">Debe seleccionar un equipo</p>
        )}
      </div>

      {/* DEBUG: Mostrar información de miembros del equipo */}
      {teamId && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <p>Debug - Equipo: {teamId}</p>
          <p>Miembros cargados: {teamUsers.length}</p>
          <p>Assigned to actual: {task.assigned_to || 'undefined'}</p>
          {teamUsers.length > 0 && (
            <p>IDs disponibles: {teamUsers.map(m => m.user.id_usuario).join(', ')}</p>
          )}
        </div>
      )}

      {teamUsers.length > 0 && (
        <Select
          value={getAssignedToValue()}
          onValueChange={handleAssignedToSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Asignar a (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Sin asignar</SelectItem>
            {teamUsers.map(member => (
              <SelectItem 
                key={member.user.id_usuario} 
                value={member.user.id_usuario.toString()}
              >
                {member.user.persona
                  ? `${member.user.persona.nombre} ${member.user.persona.apellido}`
                  : member.user.nombre_usuario}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div>
        <Input
          type="date"
          min={today}
          value={task.due_date || ''}
          onChange={handleDateChange}
          placeholder="Fecha de vencimiento (opcional)"
        />
        <p className="text-sm text-gray-500 mt-1">
          Selecciona una fecha futura (opcional)
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !isFormValid()}
        className="w-full"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </>
  );
}