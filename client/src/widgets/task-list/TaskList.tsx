import React, { useState } from 'react';
import { TaskItem } from '@/features/task-management/components/TaskItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, Filter, CheckCircle, Circle, Calendar } from 'lucide-react';
import type { Task, UpdateTaskDto } from '@/shared/types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdateTaskDto) => Promise<Task>;
}

type FilterType = 'all' | 'active' | 'completed' | 'overdue';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'active':
        return matchesSearch && !task.completed;
      case 'completed':
        return matchesSearch && task.completed;
      case 'overdue':
        return matchesSearch && task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
      default:
        return matchesSearch;
    }
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length,
  };

  const filterButtons = [
    { key: 'all' as FilterType, label: 'All', icon: Circle, count: taskStats.total },
    { key: 'active' as FilterType, label: 'Active', icon: Circle, count: taskStats.active },
    { key: 'completed' as FilterType, label: 'Completed', icon: CheckCircle, count: taskStats.completed },
    { key: 'overdue' as FilterType, label: 'Overdue', icon: Calendar, count: taskStats.overdue },
  ];

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto glass-effect">
        <CardContent className="p-8 lg:p-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 lg:w-16 lg:h-16 border-4 border-transparent border-r-primary/50 rounded-full animate-spin animation-delay-150" />
            </div>
            <div className="text-center space-y-2">
              <span className="text-lg lg:text-xl font-medium animate-in fade-in delay-300">Loading tasks...</span>
              <p className="text-sm lg:text-base text-muted-foreground animate-in fade-in delay-500">Please wait while we fetch your tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 lg:space-y-8">
      {/* Search and Filter Controls */}
      <Card className="glass-effect hover-lift transition-smooth">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
              <Filter className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Filter & Search
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 lg:pl-12 text-base lg:text-lg transition-smooth focus:scale-[1.01] hover-glow border-2 focus:border-primary/50"
            />
          </div>

          {/* Filter Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 lg:gap-3">
            {filterButtons.map(({ key, label, icon: Icon, count }, index) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key)}
                className={`transition-bounce hover-lift hover-glow animate-in slide-in-from-bottom delay-${index * 75}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.slice(0, 3)}</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-background/30 font-medium">
                  {count}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {filterButtons.map(({ key, label, icon: Icon, count }, index) => (
          <Card 
            key={key}
            className={`glass-effect hover-lift transition-bounce cursor-pointer group ${
              filter === key ? 'ring-2 ring-primary shadow-lg scale-105' : ''
            } animate-in slide-in-from-bottom delay-${index * 100}`}
            onClick={() => setFilter(key)}
          >
            <CardContent className="p-4 lg:p-6 text-center">
              <div className={`p-3 rounded-full mx-auto mb-3 transition-smooth group-hover:scale-110 ${
                filter === key 
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className={`text-2xl lg:text-3xl font-bold mb-1 transition-smooth ${
                filter === key ? 'text-primary' : ''
              }`}>
                {count}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground font-medium">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {filter === 'all' ? 'All Tasks' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks`}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Circle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No tasks found' : 'No tasks yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first task to get started!'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskItem
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};