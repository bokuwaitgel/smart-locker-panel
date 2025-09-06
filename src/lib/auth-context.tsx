'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  exp?: number; // JWT expiration time
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          Cookies.remove('token');
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (error) {
        Cookies.remove('token');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    Cookies.set('token', token, { expires: 7 }); // Set cookie to expire in 7 days
    console.log('User logged in:', decoded);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
