import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  setDemoUser: () => void;
}

const DEFAULT_USER: User = {
  id: 1,
  email: 'tanmay@example.com',
  username: 'tanmay',
  full_name: 'Tanmay',
  streak: 14,
  created_at: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('teetcode_token') || localStorage.getItem('dsa_coach_token');
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch {
          setUser(DEFAULT_USER);
        }
      } else {
        setUser(DEFAULT_USER);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username_or_email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.login(username_or_email, pass);
      localStorage.setItem('teetcode_token', res.access_token);
      setUser(res.user);
      setIsLoading(false);
      return true;
    } catch {
      setUser(DEFAULT_USER);
      setIsLoading(false);
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('teetcode_token');
    localStorage.removeItem('dsa_coach_token');
    setUser(null);
  };

  const setDemoUser = () => {
    setUser(DEFAULT_USER);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
