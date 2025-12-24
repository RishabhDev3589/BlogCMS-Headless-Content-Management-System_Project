/**
 * CREATE POST PAGE
 * Form page for creating new blog posts.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostEditor } from '@/components/admin/PostEditor';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { PostFormData } from '@/types/blog';

export default function CreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { createPost } = usePosts();
  const { categories } = useCategories();

  // Handle form submission
  const handleSave = async (formData: PostFormData) => {
    setIsLoading(true);
    
    const result = await createPost(formData);
    
    if (result) {
      // Navigate to edit page or posts list
      navigate('/admin/posts');
    }
    
    setIsLoading(false);
  };

  return (
    <PostEditor
      categories={categories}
      onSave={handleSave}
      isLoading={isLoading}
      mode="create"
    />
  );
}
