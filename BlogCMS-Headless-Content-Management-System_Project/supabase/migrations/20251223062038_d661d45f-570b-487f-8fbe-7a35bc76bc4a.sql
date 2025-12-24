-- ==============================================
-- BLOG CMS DATABASE SCHEMA
-- Step-by-step migration for internship project
-- ==============================================

-- STEP 1: Create categories table
-- Categories help organize blog posts (e.g., "Technology", "Lifestyle")
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- STEP 2: Create blog_posts table
-- Main table storing all blog content
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image TEXT,
  author_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- STEP 3: Create indexes for faster queries
-- Indexes speed up common lookups (by slug, status, author)
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- STEP 4: Enable Row Level Security (RLS)
-- RLS ensures users can only access their own data
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create RLS policies for blog_posts
-- Policy: Anyone can READ published posts (public blog)
CREATE POLICY "Public can read published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Policy: Authenticated admins can do everything with their posts
CREATE POLICY "Admins can manage their own posts"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy: Authenticated admins can read all posts (for admin panel)
CREATE POLICY "Admins can read all posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- STEP 6: Create RLS policies for categories
-- Categories are public (anyone can read)
CREATE POLICY "Anyone can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Only authenticated users can manage categories
CREATE POLICY "Authenticated users can manage categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STEP 7: Create function to auto-update updated_at timestamp
-- This trigger automatically updates the updated_at field
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- STEP 8: Create trigger to auto-update timestamps
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- STEP 9: Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Posts about tech, coding, and software'),
  ('Lifestyle', 'lifestyle', 'Posts about daily life and personal growth'),
  ('Business', 'business', 'Posts about entrepreneurship and business'),
  ('Tutorial', 'tutorial', 'Step-by-step guides and how-to articles');