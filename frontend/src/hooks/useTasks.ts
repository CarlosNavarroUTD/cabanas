// src/hooks/useTasks.ts
import { create } from 'zustand';
import { tasksService } from '@/services/tasks.service';
import { Task, TaskFilters, TasksStore } from '@/types/tasksTypes';


export const useTasks = create<TasksStore>((set, get) => ({
  tasks: [],
  isLoading: false,

  createTask: async (data) => {
    try {
      set({ isLoading: true });
      await tasksService.createTask(data);
      await get().fetchTasks({ team: data.team }); // Refresh tasks for the team
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTasks: async (filters?: TaskFilters) => {
    try {
      set({ isLoading: true });
      const tasks = await tasksService.getTasks(filters);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
    }
  },

  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      set({ isLoading: true });
      await tasksService.changeTaskStatus(taskId, status);
      const currentTasks = get().tasks;
      const teamId = currentTasks.find(task => task.id === taskId)?.team;
      if (teamId) {
        await get().fetchTasks({ team: teamId }); // Refresh tasks for the team
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (taskId: number, data: Partial<Omit<Task, 'id'>>) => {
    try {
      set({ isLoading: true });
      await tasksService.updateTask(taskId, data);
      const currentTasks = get().tasks;
      const teamId = currentTasks.find(task => task.id === taskId)?.team;
      if (teamId) {
        await get().fetchTasks({ team: teamId }); // Refresh tasks for the team
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId: number) => {
    try {
      set({ isLoading: true });
      const currentTasks = get().tasks;
      const teamId = currentTasks.find(task => task.id === taskId)?.team;
      await tasksService.deleteTask(taskId);
      if (teamId) {
        await get().fetchTasks({ team: teamId }); // Refresh tasks for the team
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
