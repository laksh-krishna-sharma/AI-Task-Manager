import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { UserPlus, User, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
  loading: boolean;
  error?: string;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  error,
  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim() || password !== confirmPassword) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ username: username.trim(), password });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameValid = username.trim().length >= 3;
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword === password && password.length > 0;
  const isFormValid = isUsernameValid && isPasswordValid && isConfirmPasswordValid;
  const isDisabled = loading || isSubmitting;

  return (
    <Card className="w-full max-w-md glass-effect hover-lift transition-smooth border-2 hover:border-primary/20">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl lg:text-2xl">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg hover-glow transition-smooth">
            <UserPlus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          Create Account
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Sign up to start managing your tasks
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
            <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
              {isUsernameValid && <CheckCircle className="w-4 h-4 text-green-500" />}
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username (min 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isDisabled}
              className="transition-smooth focus:scale-[1.02] hover-glow"
              autoComplete="username"
            />
            {username.length > 0 && !isUsernameValid && (
              <p className="text-xs text-muted-foreground">Username must be at least 3 characters</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
              {isPasswordValid && <CheckCircle className="w-4 h-4 text-green-500" />}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDisabled}
                className="transition-smooth focus:scale-[1.02] hover-glow pr-10"
                autoComplete="new-password"
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
            {password.length > 0 && !isPasswordValid && (
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm Password
              {isConfirmPasswordValid && <CheckCircle className="w-4 h-4 text-green-500" />}
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isDisabled}
                className="transition-smooth focus:scale-[1.02] hover-glow pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isDisabled}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !isConfirmPasswordValid && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isDisabled || !isFormValid}
            className="w-full transition-bounce hover:scale-105 hover-glow"
          >
            <UserPlus className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline font-medium transition-colors"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};