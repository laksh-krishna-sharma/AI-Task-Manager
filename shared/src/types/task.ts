export type Task = {
  id?: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  userId: string;
};
