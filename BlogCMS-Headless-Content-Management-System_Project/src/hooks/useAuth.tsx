/**
 * AUTH HOOK
 * Custom React hook to manage authentication state.
 * Provides user info and auth functions to components.
 * 
 * Interview tip: "I created a custom hook to centralize auth logic
 * and make it reusable across the application."
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

// Simple user type (customize as needed)
interface User {
  email: string;
  isAdmin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for user info and token
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    if (token && userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error("Failed to parse user info", e);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      // Save to local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        email: data.email,
        isAdmin: data.isAdmin
      }));

      setUser({ email: data.email, isAdmin: data.isAdmin });

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      navigate('/admin');
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      return { error: { message: errorMessage } };
    }
  }, [navigate, toast]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);

    toast({
      title: "Logged out",
      description: "See you next time!",
    });

    navigate('/');
  }, [navigate, toast]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
