/**
 * ADMIN POSTS LIST PAGE
 * Shows all blog posts with filtering options.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PostsTable } from '@/components/admin/PostsTable';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { PenSquare, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '@/types/blog';

export default function AdminPosts() {
  const { posts, loading, deletePost, fetchPosts } = usePosts();
  const { categories } = useCategories();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Refresh posts on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts based on search and filters
  const filteredPosts = posts.filter((post: BlogPost) => {
    // Search filter
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || post.category_id === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">All Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts
          </p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PenSquare className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredPosts.length} of {posts.length} posts
      </p>

      {/* Posts Table */}
      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <PostsTable 
          posts={filteredPosts} 
          categories={categories}
          onDelete={deletePost}
        />
      )}
    </div>
  );
}
