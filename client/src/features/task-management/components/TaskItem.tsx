import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Card, CardContent } from '@/shared/ui/card';
import { Trash2, Calendar, Clock, Edit3, Check, X } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import type { Task, UpdateTaskDto } from '@/shared/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdateTaskDto) => Promise<Task>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        dueDate: editDueDate || undefined,
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && !task.completed;
    
    return {
      formatted: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOverdue,
    };
  };

  const dueDateInfo = task.dueDate ? formatDate(task.dueDate) : null;

  return (
    <Card 
      className={`group transition-smooth hover-lift hover-glow ${
        task.completed ? 'opacity-75 bg-muted/30 glass-effect' : 'glass-effect'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''} border-2 hover:border-primary/20`}
    >
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start gap-3 lg:gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="mt-1 transition-bounce hover:scale-125 hover-glow"
          />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-base"
                  disabled={isLoading}
                />
                <Input
                  type="datetime-local"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="text-sm"
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editTitle.trim() || isLoading}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 
                  className={`text-base lg:text-lg font-medium transition-smooth ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-sm lg:text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {dueDateInfo && (
                    <div className={`flex items-center gap-2 ${
                      dueDateInfo.isOverdue ? 'text-destructive animate-in pulse-glow' : ''
                    }`}>
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>{dueDateInfo.formatted}</span>
                      {dueDateInfo.isOverdue && (
                        <span className="text-xs lg:text-sm font-medium px-2 py-1 bg-destructive/10 rounded-full animate-in bounce-in">
                          Overdue
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="transition-bounce hover:scale-125 hover-glow"
              >
                <Edit3 className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isLoading}
                className="transition-bounce hover:scale-125 hover:text-destructive hover-glow"
              >
                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};