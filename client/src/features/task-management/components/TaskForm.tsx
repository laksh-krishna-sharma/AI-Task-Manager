import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus, Calendar } from 'lucide-react';
import type { CreateTaskDto, Task } from '@/shared/types/task';

interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => Promise<Task>;
  loading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        dueDate: dueDate || undefined,
        completed: false,
      });
      
      // Reset form on success
      setTitle('');
      setDueDate('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = loading || isSubmitting;

  return (
    <Card className="glass-effect hover-lift transition-smooth border-2 hover:border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg hover-glow transition-smooth">
            <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          Add New Task
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm lg:text-base font-medium">
              Task Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isDisabled}
              className="text-base transition-smooth focus:scale-[1.02] hover-glow"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm lg:text-base font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date (Optional)
            </label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isDisabled}
              className="text-base transition-smooth focus:scale-[1.02] hover-glow"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full transition-bounce hover:scale-105 hover-glow animate-in slide-in-from-bottom delay-300"
          >
            <Plus className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
            {isSubmitting ? 'Creating Task...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};