/**
 * ADMIN LAYOUT COMPONENT
 * Wraps all admin pages with sidebar and main content area.
 * Handles authentication check and redirects.
 * 
 * Interview tip: "I used a layout component pattern to avoid
 * repeating the sidebar and auth logic on every admin page."
 */

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar */}
      <AdminSidebar />
      
      {/* Main content area with left margin for sidebar */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
