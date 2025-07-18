import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authApi, type User, type LoginCredentials, type RegisterCredentials } from '@/entities/auth/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setState({
            user,
            token,
            loading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authApi.login(credentials);
      
      // Store auth data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      setState({
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authApi.register(credentials);
      
      // Auto-login after successful registration
      await login({ email: credentials.email, password: credentials.password });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [login]);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      setState({
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
  };
};

export { AuthContext };