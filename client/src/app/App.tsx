import React from 'react';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { TasksPage } from '@/pages/tasks/TasksPage';
import { AuthPage } from '@/pages/auth/AuthPage';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-in fade-in">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <TasksPage /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;