/**
 * BLOG CARD COMPONENT
 * Displays a single blog post preview in the listing.
 * Shows title, excerpt, category, and date.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost, Category } from '@/types/blog';
import { formatDate } from '@/lib/slugify';
import { ArrowRight, Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  category?: Category | null;
}

export function BlogCard({ post, category }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        <CardHeader className="pb-2">
          {/* Category Badge */}
          {category && (
            <Badge variant="secondary" className="w-fit mb-2">
              {category.name}
            </Badge>
          )}
          
          {/* Title */}
          <h2 className="font-display text-xl font-semibold leading-tight group-hover:text-accent transition-colors">
            {post.title}
          </h2>
        </CardHeader>
        
        <CardContent>
          {/* Excerpt */}
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <span className="flex items-center gap-1 text-accent font-medium group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
