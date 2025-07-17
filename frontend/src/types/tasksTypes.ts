// src/types/tasksTypes.ts - VERSIÓN CORREGIDA
import { User } from '@/types/usersTypes';

export interface Team {
  id: number;
  name: string;
}

export interface TeamMember {
  user: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  team: number;
  created_by?: User;
  assigned_to?: User; // Siempre será objeto User en las respuestas
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  due_date?: string;
  created_at?: string; 
  updated_at?: string; 
  comments?: TaskComment[]; 
}

export interface TaskComment {
  id: number;
  task: number;
  user: User;
  content: string;
  created_at: string;
}

// CORRECCIÓN: Usar assigned_to_id para envío al backend
export interface NewTask {
  title: string;
  description?: string;
  team: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  due_date?: string;
  assigned_to_id?: number; // Cambiado de assigned_to a assigned_to_id
}

// CORRECCIÓN: Usar assigned_to_id para actualizaciones
export interface UpdateTask {
  title?: string;
  description?: string;
  assigned_to_id?: number; // Cambiado de assigned_to a assigned_to_id
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  due_date?: string;
}

// El formulario sigue usando assigned_to internamente
export interface TaskFormData {
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  due_date?: string;
  team: number | undefined;
  assigned_to?: number; // Mantener como assigned_to para el formulario
}

export interface TaskFormFieldsProps {
  task: TaskFormData;
  setTask: React.Dispatch<React.SetStateAction<TaskFormData>>;
  teams: Team[];
  members: Record<number, TeamMember[]>;
  getTeamMembers: (teamId: number) => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  isEditing?: boolean;
  showValidationErrors?: boolean;
}

export interface TaskFilters {
  status?: string;
  team?: number;
  due_date?: string;
}

export interface TasksStore {
  tasks: Task[];
  isLoading: boolean;
  createTask: (data: NewTask) => Promise<void>;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  updateTaskStatus: (taskId: number, status: string) => Promise<void>;
  updateTask: (taskId: number, data: UpdateTask) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

