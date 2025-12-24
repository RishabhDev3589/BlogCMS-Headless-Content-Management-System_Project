/**
 * BLOG LAYOUT COMPONENT
 * Wraps all public blog pages with header and footer.
 */

import { Outlet } from 'react-router-dom';
import { BlogHeader } from './BlogHeader';

export function BlogLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlogCMS — Internship Project
          </p>
        </div>
      </footer>
    </div>
  );
}
