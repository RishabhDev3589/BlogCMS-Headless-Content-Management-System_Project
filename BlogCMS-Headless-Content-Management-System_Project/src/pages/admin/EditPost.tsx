/**
 * EDIT POST PAGE
 * Form page for editing existing blog posts.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostEditor } from '@/components/admin/PostEditor';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { PostFormData, BlogPost } from '@/types/blog';
import { Loader2 } from 'lucide-react';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const { fetchPostById, updatePost } = usePosts();
  const { categories } = useCategories();

  // Fetch post data on mount
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      const data = await fetchPostById(id);
      
      if (data) {
        setPost(data);
      } else {
        // Post not found, redirect to posts list
        navigate('/admin/posts');
      }
      
      setIsLoading(false);
    };
    
    loadPost();
  }, [id, fetchPostById, navigate]);

  // Handle form submission
  const handleSave = async (formData: PostFormData) => {
    if (!id) return;
    
    setIsSaving(true);
    
    const result = await updatePost(id, formData);
    
    if (result) {
      navigate('/admin/posts');
    }
    
    setIsSaving(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  // Convert post to form data
  const initialData: PostFormData = {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    category_id: post.category_id,
    status: post.status,
    featured_image: post.featured_image,
  };

  return (
    <PostEditor
      initialData={initialData}
      categories={categories}
      onSave={handleSave}
      isLoading={isSaving}
      mode="edit"
    />
  );
}
