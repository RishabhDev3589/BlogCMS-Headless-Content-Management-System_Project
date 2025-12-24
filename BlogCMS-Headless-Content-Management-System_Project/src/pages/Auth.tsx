/**
 * AUTH PAGE
 * Login page for admin access.
 * Uses Custom API authentication.
 * 
 * Interview tip: "I replaced Supabase with a custom Node.js/Express backend 
 * to demonstrate full control over the authentication flow using JWTs."
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api'; // Import our new API client
import { PenSquare, Loader2, Mail, Lock, UserPlus } from 'lucide-react';

// Validation schema using Zod
const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'email' | 'password'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Login
        const { data } = await api.post('/auth/login', { email, password });

        // Save to local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify({
          email: data.email,
          isAdmin: data.isAdmin
        }));

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate('/admin');
      } else {
        // Sign up (For initialization purposes)
        const { data } = await api.post('/auth/register', { email, password });

        // Save to local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify({
          email: data.email,
          isAdmin: data.isAdmin
        }));

        toast({
          title: "Account created!",
          description: "You are now logged in as admin.",
        });
        navigate('/admin');
      }
    } catch (err: any) {
      // Handle error
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      toast({
        variant: "destructive",
        title: mode === 'login' ? "Login failed" : "Sign up failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4">
            <PenSquare className="w-8 h-8 text-primary-foreground" />
          </div>

          <CardTitle className="text-2xl font-display">
            {mode === 'login' ? 'Admin Login' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Enter your credentials to access the dashboard'
              : 'Create a new admin account (For Setup Only)'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : mode === 'login' ? (
                <Lock className="w-4 h-4 mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
                type="button"
              >
                {mode === 'login'
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
