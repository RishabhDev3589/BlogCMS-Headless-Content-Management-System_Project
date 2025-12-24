/**
 * ADMIN DASHBOARD PAGE
 * Main landing page for the admin panel.
 * Shows stats and recent posts overview.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/admin/StatsCard';
import { PostsTable } from '@/components/admin/PostsTable';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { FileText, Eye, FolderOpen, PenSquare, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { posts, loading: postsLoading, deletePost, fetchPosts } = usePosts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Calculate stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const draftPosts = posts.filter((p) => p.status === 'draft').length;
  const recentPosts = posts.slice(0, 5); // Last 5 posts

  // Refresh posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loading = postsLoading || categoriesLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your blog management dashboard
          </p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PenSquare className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Posts"
              value={totalPosts}
              icon={FileText}
            />
            <StatsCard
              title="Published"
              value={publishedPosts}
              icon={Eye}
              description="Live on your blog"
            />
            <StatsCard
              title="Drafts"
              value={draftPosts}
              icon={Clock}
              description="Not yet published"
            />
            <StatsCard
              title="Categories"
              value={categories.length}
              icon={FolderOpen}
            />
          </>
        )}
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Recent Posts</h2>
          <Link to="/admin/posts" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <Skeleton className="h-64" />
        ) : (
          <PostsTable 
            posts={recentPosts} 
            categories={categories}
            onDelete={deletePost}
          />
        )}
      </div>
    </div>
  );
}
