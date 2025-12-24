/**
 * SINGLE BLOG POST PAGE
 * Displays a full blog post with content.
 * Uses the slug from URL to fetch the post.
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { BlogPost, Category } from '@/types/blog';
import { formatDate } from '@/lib/slugify';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { fetchPostBySlug } = usePosts();
  const { categories } = useCategories();

  // Fetch post by slug
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      const data = await fetchPostBySlug(slug);
      setPost(data);
      setLoading(false);
    };
    
    loadPost();
  }, [slug, fetchPostBySlug]);

  // Get category for this post
  const category: Category | undefined = categories.find(
    (c) => c.id === post?.category_id
  );

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      {/* Back Link */}
      <Link 
        to="/blog" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to all posts
      </Link>

      {/* Header */}
      <header className="mb-8">
        {/* Category */}
        {category && (
          <Badge variant="secondary" className="mb-4">
            {category.name}
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-10 rounded-xl overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto aspect-video object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <Link to="/blog">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Button>
        </Link>
      </footer>
    </article>
  );
}
