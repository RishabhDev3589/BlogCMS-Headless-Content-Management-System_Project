/**
 * ADMIN SIDEBAR COMPONENT
 * Navigation sidebar for the admin dashboard.
 * Uses dark theme with amber accents.
 * 
 * Interview tip: "I designed the admin interface with a dark sidebar
 * to reduce eye strain and create visual separation from the content area."
 */

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  LogOut,
  PenSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Navigation items with icons
const navItems = [
  { 
    path: '/admin', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    exact: true  // Only match exact path
  },
  { 
    path: '/admin/posts', 
    label: 'All Posts', 
    icon: FileText 
  },
  { 
    path: '/admin/posts/new', 
    label: 'New Post', 
    icon: PenSquare 
  },
  { 
    path: '/admin/categories', 
    label: 'Categories', 
    icon: FolderOpen 
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Check if current path matches nav item
  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <PenSquare className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-sidebar-foreground">
            BlogCMS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                active 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                active && "text-sidebar-primary"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4 px-4">
          <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">
            Logged in as
          </p>
          <p className="text-sm text-sidebar-foreground truncate mt-1">
            {user?.email}
          </p>
        </div>
        
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>

      {/* View Blog Link */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-center gap-2 text-sm text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors"
        >
          View Public Blog →
        </Link>
      </div>
    </aside>
  );
}
