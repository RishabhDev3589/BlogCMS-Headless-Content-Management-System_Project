/**
 * POSTS HOOK
 * Custom hook for managing blog posts CRUD operations.
 * Uses Custom API for data persistence.
 * 
 * Interview tip: "I used custom hooks to separate data logic
 * from UI components, making the code more maintainable."
 */

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { BlogPost, PostFormData } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Helper to map backend _id to frontend id, and handle field naming differences
const mapPost = (post: any): BlogPost => ({
  ...post,
  id: post._id,
  category_id: post.category || post.category_id, // Map backend 'category' to frontend 'category_id'
  author_id: post.author || post.author_id,       // Map backend 'author' to frontend 'author_id'
  created_at: post.createdAt || post.created_at,  // Map Mongoose camelCase to snake_case
  updated_at: post.updatedAt || post.updated_at,
  featured_image: post.image || post.featured_image, // Map backend 'image' to frontend 'featured_image'
});

export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth(); // We check auth mainly for local state, API checks token

  // Fetch all posts (for admin)
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts?all=true'); // Admin endpoint logic

      setPosts(data.map(mapPost));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Failed to load posts",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch published posts only (for public blog)
  const fetchPublishedPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts'); // Public endpoint logic
      setPosts(data.map(mapPost));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new post
  const createPost = useCallback(async (formData: PostFormData) => {
    try {
      // Helper to map frontend keys to backend expected keys
      const payload = {
        ...formData,
        image: formData.featured_image, // Map frontend 'featured_image' to backend 'image'
      };

      // Backend handles slug generation if not provided, but valid to send it
      const { data } = await api.post('/posts', payload);

      toast({
        title: formData.status === 'published' ? "Post published!" : "Draft saved",
        description: `"${formData.title}" has been ${formData.status === 'published' ? 'published' : 'saved as draft'}.`,
      });

      return mapPost(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: errorMessage,
      });
      return null;
    }
  }, [toast]);

  // Update an existing post
  const updatePost = useCallback(async (id: string, formData: PostFormData) => {
    try {
      const payload = {
        ...formData,
        image: formData.featured_image, // Map frontend 'featured_image' to backend 'image'
      };

      const { data } = await api.put(`/posts/${id}`, payload);

      toast({
        title: "Post updated",
        description: `"${formData.title}" has been updated.`,
      });

      return mapPost(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Failed to update post",
        description: errorMessage,
      });
      return null;
    }
  }, [toast]);

  // Delete a post
  const deletePost = useCallback(async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);

      // Update local state
      setPosts((prev) => prev.filter((p) => p.id !== id));

      toast({
        title: "Post deleted",
        description: "The post has been permanently deleted.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Failed to delete post",
        description: errorMessage,
      });
    }
  }, [toast]);

  // Fetch single post by slug (for public view)
  const fetchPostBySlug = useCallback(async (slug: string) => {
    try {
      const { data } = await api.get(`/posts/${slug}`);
      return mapPost(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return null;
    }
  }, []);

  // Fetch single post by ID (for editing)
  const fetchPostById = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      return mapPost(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return null;
    }
  }, []);

  // Load posts on mount (Only if we want auto-load, usually dashboard does it)
  // We can keep it or let component call it. The original hook called it.
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    fetchPublishedPosts,
    fetchPostBySlug,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  };
}
