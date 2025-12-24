/**
 * APP ROUTER
 * Main application router with all routes defined.
 * 
 * Route structure:
 * - / : Home page (public)
 * - /blog : Blog listing (public)
 * - /blog/:slug : Single post (public)
 * - /auth : Login page
 * - /admin/* : Admin dashboard (protected)
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogLayout } from "@/components/blog/BlogLayout";

// Public Pages
import Home from "@/pages/Index";
import AuthPage from "@/pages/Auth";
import BlogListing from "@/pages/blog/BlogListing";
import BlogDetail from "@/pages/blog/BlogDetail";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPosts from "@/pages/admin/Posts";
import CreatePost from "@/pages/admin/CreatePost";
import EditPost from "@/pages/admin/EditPost";
import Categories from "@/pages/admin/Categories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Blog Layout */}
          <Route element={<BlogLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogListing />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
          </Route>
          
          {/* Auth Route (no layout) */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Admin Routes (protected with AdminLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<CreatePost />} />
            <Route path="posts/:id/edit" element={<EditPost />} />
            <Route path="categories" element={<Categories />} />
          </Route>
          
          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
