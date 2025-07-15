import React, { useState } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CheckSquare } from 'lucide-react';

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { login, register, loading, error, clearError } = useAuth();

  const handleSwitchMode = () => {
    clearError();
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-in fade-in float delay-500"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-in fade-in float delay-700"></div>
      </div>

      {/* Header */}
      <header className="glass-effect border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-center gap-3 animate-in slide-in-from-top duration-700">
            <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg hover-glow transition-smooth">
              <CheckSquare className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Stay organized and productive
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4 relative z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {mode === 'login' ? (
            <LoginForm
              onSubmit={login}
              loading={loading}
              error={error || undefined}
              onSwitchToRegister={handleSwitchMode}
            />
          ) : (
            <RegisterForm
              onSubmit={register}
              loading={loading}
              error={error || undefined}
              onSwitchToLogin={handleSwitchMode}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-muted-foreground">
          <p className="text-sm">Built with React, TypeScript, Tailwind CSS, and shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
};