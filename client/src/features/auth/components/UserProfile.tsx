import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const UserProfile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover-lift transition-smooth"
        disabled={loading}
      >
        <div className="p-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-full mt-2 w-64 glass-effect border-2 z-50 animate-in fade-in slide-in-from-top duration-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">User ID: {user.id.slice(0, 8)}...</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover-lift"
                    onClick={() => {
                      setIsOpen(false);
                      // TODO: Implement settings
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover-lift text-destructive hover:text-destructive"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    <LogOut className="w-4 h-4" />
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};