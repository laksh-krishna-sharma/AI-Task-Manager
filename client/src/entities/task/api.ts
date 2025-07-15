import { apiClient } from '@/shared/api/base';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/shared/types/task';

export const taskApi = {
  async getTasks(): Promise<Task[]> {
    return apiClient.get<Task[]>('/api/tasks');
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    return apiClient.post<Task>('/api/tasks', data);
  },

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return apiClient.patch<Task>(`/api/tasks/${id}`, data);
  },

  async deleteTask(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/tasks/${id}`);
  },
};