/**
 * BLOG TYPES
 * These TypeScript interfaces define the shape of our data.
 * Interview tip: "I used TypeScript interfaces to ensure type safety
 * and make the code self-documenting."
 */

// Post status: either 'draft' (not public) or 'published' (public)
export type PostStatus = 'draft' | 'published';

// Main blog post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;  // URL-friendly version of title (e.g., "my-first-post")
  content: string;  // HTML content from Quill editor
  excerpt: string;  // Short preview text for listings
  category_id: string | null;
  status: PostStatus;
  featured_image: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

// Category for organizing posts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

// Form data for creating/editing posts
export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  category_id: string | null;
  status: PostStatus;
  featured_image: string | null;
}

// Form data for creating/editing categories
export interface CategoryFormData {
  name: string;
  description: string;
}

// Admin user profile
export interface AdminProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
}
