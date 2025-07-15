import React from 'react';
import { TaskForm } from '@/features/task-management/components/TaskForm';
import { TaskList } from '@/widgets/task-list/TaskList';
import { useTasks } from '@/features/task-management/hooks/useTasks';
import { Card, CardContent } from '@/shared/ui/card';
import { CheckSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/features/auth/components/UserProfile';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch,
  } = useTasks();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-in fade-in float"></div>
        </div>
        <Card className="w-full max-w-md glass-effect animate-in bounce-in duration-700 hover-lift">
          <CardContent className="p-6 lg:p-8 text-center">
            <div className="animate-in wiggle delay-300">
              <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-destructive" />
            </div>
            <h2 className="text-xl lg:text-2xl font-semibold mb-2 animate-in slide-in-from-top delay-200">Something went wrong</h2>
            <p className="text-muted-foreground mb-6 animate-in fade-in delay-300">{error}</p>
            <Button 
              onClick={refetch} 
              className="transition-bounce hover-lift hover-glow animate-in slide-in-from-bottom delay-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-in fade-in float delay-500"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-in fade-in float delay-700"></div>
      </div>

      {/* Header */}
      <header className="glass-effect border-b sticky top-0 z-50 animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 animate-in slide-in-from-left duration-700 delay-200">
              <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg hover-glow transition-smooth">
                <CheckSquare className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Task Manager
                </h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Stay organized and productive
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 lg:gap-4 animate-in slide-in-from-right duration-700 delay-300">
              <div className="text-center lg:text-right">
                <div className="text-xs lg:text-sm text-muted-foreground">Total Tasks</div>
                <div className="text-xl lg:text-2xl font-bold text-primary animate-in bounce-in delay-500">{tasks.length}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={loading}
                className="transition-bounce hover-lift hover-glow"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 space-y-6 lg:space-y-12 relative z-10">
        {/* Task Form */}
        <div className="animate-in fade-in slide-in-from-top duration-700 delay-300">
          <TaskForm onSubmit={createTask} loading={loading} />
        </div>

        {/* Task List */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <TaskList
            tasks={tasks}
            loading={loading}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t mt-16 lg:mt-24 animate-in fade-in delay-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p className="text-sm lg:text-base">AI task manager</p>
        </div>
      </footer>
    </div>
  );
};