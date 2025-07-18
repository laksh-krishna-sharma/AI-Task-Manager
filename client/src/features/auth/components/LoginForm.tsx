import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  loading: boolean;
  error?: string;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ email: email.trim(), password });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = loading || isSubmitting;

  return (
    <Card className="w-full max-w-md glass-effect hover-lift transition-smooth border-2 hover:border-primary/20">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl lg:text-2xl">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg hover-glow transition-smooth">
            <LogIn className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          Welcome Back
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-in fade-in">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isDisabled}
              className="transition-smooth focus:scale-[1.02] hover-glow"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDisabled}
                className="transition-smooth focus:scale-[1.02] hover-glow pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isDisabled}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isDisabled || !email.trim() || !password.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
            className="w-full transition-bounce hover:scale-105 hover-glow"
          >
            <LogIn className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary hover:underline font-medium transition-colors"
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};