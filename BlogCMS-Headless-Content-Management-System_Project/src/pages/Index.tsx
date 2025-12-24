/**
 * HOME PAGE
 * Landing page showing featured posts and intro.
 * Redirects users to either the blog or admin.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog/BlogCard';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { BlogPost, Category } from '@/types/blog';
import { PenSquare, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { posts, loading, fetchPublishedPosts } = usePosts();
  const { categories } = useCategories();

  // Fetch only published posts
  useEffect(() => {
    fetchPublishedPosts();
  }, [fetchPublishedPosts]);

  // Get latest 3 posts for featured section
  const featuredPosts = posts.slice(0, 3);

  // Helper to get category by ID
  const getCategoryById = (id: string | null): Category | null => {
    if (!id) return null;
    return categories.find((c) => c.id === id) || null;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-6">
            <PenSquare className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Welcome to <span className="text-accent">BlogCMS</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            A modern headless CMS for publishing beautiful blog content.
            Built with React, TypeScript, and a Cloud-Based Backend System.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Read the Blog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section >

      {/* Featured Posts */}
      < section className="py-16 px-4" >
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-display font-bold">Latest Posts</h2>
            <Link
              to="/blog"
              className="text-accent hover:underline font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : featuredPosts.length === 0 ? (
            <div className="text-center py-16 bg-secondary/30 rounded-xl">
              <p className="text-muted-foreground text-lg mb-4">
                No posts published yet.
              </p>
              <Link to="/auth">
                <Button variant="outline">
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
              {featuredPosts.map((post: BlogPost) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  category={getCategoryById(post.category_id)}
                />
              ))}
            </div>
          )}
        </div>
      </section >

      {/* Features Section */}
      < section className="py-16 px-4 bg-secondary/30" >
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            CMS Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                Rich Text Editor
              </h3>
              <p className="text-muted-foreground text-sm">
                Write beautiful content with Quill.js WYSIWYG editor
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                JWT Authentication
              </h3>
              <p className="text-muted-foreground text-sm">
                Secure admin access with token-based authentication
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📂</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                Categories & Drafts
              </h3>
              <p className="text-muted-foreground text-sm">
                Organize content with categories and draft/publish workflow
              </p>
            </div>
          </div>
        </div>
      </section >


    </div >
  );
}
