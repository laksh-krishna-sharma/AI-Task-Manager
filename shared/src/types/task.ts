export type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  userId: string;
};

export type CreateTaskDto = {
  title: string;
  dueDate?: string | null;
  completed?: boolean;
};

export type UpdateTaskDto = {
  title?: string;
  dueDate?: string | null;
  completed?: boolean;
};
