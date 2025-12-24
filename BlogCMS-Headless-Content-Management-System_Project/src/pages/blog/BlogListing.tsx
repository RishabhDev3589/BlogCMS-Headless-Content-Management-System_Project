/**
 * PUBLIC BLOG LISTING PAGE
 * Shows all published blog posts.
 * This is the main public-facing page of the blog.
 */

import { useEffect, useState } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost, Category } from '@/types/blog';

export default function BlogListing() {
  const { posts, loading, fetchPublishedPosts } = usePosts();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch only published posts
  useEffect(() => {
    fetchPublishedPosts();
  }, [fetchPublishedPosts]);

  // Filter posts by category
  const filteredPosts = selectedCategory
    ? posts.filter((p: BlogPost) => p.category_id === selectedCategory)
    : posts;

  // Helper to get category by ID
  const getCategoryById = (id: string | null): Category | null => {
    if (!id) return null;
    return categories.find((c) => c.id === id) || null;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          The Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover insightful articles, tutorials, and stories from our team.
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10 animate-slide-up">
          <Badge
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setSelectedCategory(null)}
          >
            All Posts
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "secondary"}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No posts published yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {filteredPosts.map((post: BlogPost) => (
            <BlogCard
              key={post.id}
              post={post}
              category={getCategoryById(post.category_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
