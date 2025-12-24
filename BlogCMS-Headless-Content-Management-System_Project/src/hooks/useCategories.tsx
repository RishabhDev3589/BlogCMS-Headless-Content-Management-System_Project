/**
 * CATEGORIES HOOK
 * Custom hook for managing blog categories.
 * Simpler than posts since categories are basic CRUD.
 */

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Category, CategoryFormData } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

// Helper to map backend _id
const mapCategory = (cat: any): Category => ({
  ...cat,
  id: cat._id,
});

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data.map(mapCategory));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Failed to load categories",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new category
  const createCategory = useCallback(async (formData: CategoryFormData) => {
    try {
      const { data } = await api.post('/categories', formData);

      const newCategory = mapCategory(data);

      // Add to local state
      setCategories((prev) => [...prev, newCategory].sort((a, b) =>
        a.name.localeCompare(b.name)
      ));

      toast({
        title: "Category created",
        description: `"${formData.name}" has been added.`,
      });

      return newCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Failed to create category",
        description: errorMessage,
      });
      return null;
    }
  }, [toast]);

  // Delete a category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);

      setCategories((prev) => prev.filter((c) => c.id !== id));

      toast({
        title: "Category deleted",
        description: "The category has been removed.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: "Failed to delete category",
        description: errorMessage,
      });
    }
  }, [toast]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
}
