/**
 * POSTS TABLE COMPONENT
 * Displays all blog posts in a sortable table format.
 * Allows editing and deleting posts.
 * 
 * Interview tip: "I used a table layout for post management
 * as it allows admins to quickly scan and manage multiple posts."
 */

import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BlogPost, Category } from '@/types/blog';
import { formatDate } from '@/lib/slugify';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

interface PostsTableProps {
  posts: BlogPost[];
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
}

export function PostsTable({ posts, categories, onDelete }: PostsTableProps) {
  // Helper to get category name by ID
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">No posts found.</p>
        <Link to="/admin/posts/new">
          <Button className="mt-4">Create your first post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="group">
              <TableCell className="font-medium">
                <div>
                  <p className="font-display font-semibold">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    /{post.slug}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getCategoryName(post.category_id)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={post.status === 'published' ? 'default' : 'secondary'}
                  className={post.status === 'published' 
                    ? 'bg-success/10 text-success hover:bg-success/20' 
                    : ''
                  }
                >
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* View on blog */}
                  {post.status === 'published' && (
                    <Link to={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" title="View post">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  
                  {/* Edit */}
                  <Link to={`/admin/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="icon" title="Edit post">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  {/* Delete with confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete post"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{post.title}". 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(post.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
