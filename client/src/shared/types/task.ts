export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  dueDate?: string;
  completed?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  dueDate?: string;
  completed?: boolean;
}