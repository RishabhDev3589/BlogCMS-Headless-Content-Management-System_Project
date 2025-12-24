/**
 * BLOG HEADER COMPONENT
 * Public-facing header for the blog.
 * Clean, minimal design with navigation.
 */

import { Link } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:bg-accent transition-colors">
              <PenSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">
              The Blog
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              All Posts
            </Link>
          </nav>

          {/* Admin Link */}
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
