/**
 * POST EDITOR COMPONENT
 * Rich text editor using Quill.js for creating/editing blog posts.
 * Includes title, category, status, and content fields.
 * 
 * Interview tip: "I integrated Quill.js for the rich text editor
 * because it provides a clean WYSIWYG experience."
 */

import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, PostFormData, PostStatus } from '@/types/blog';
import { Save, Eye, FileText } from 'lucide-react';

// Quill toolbar configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

interface PostEditorProps {
  initialData?: PostFormData;
  categories: Category[];
  onSave: (data: PostFormData) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export function PostEditor({ 
  initialData, 
  categories, 
  onSave, 
  isLoading = false,
  mode 
}: PostEditorProps) {
  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [categoryId, setCategoryId] = useState<string | null>(
    initialData?.category_id || null
  );
  const [status, setStatus] = useState<PostStatus>(
    initialData?.status || 'draft'
  );
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    initialData?.featured_image || null
  );

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setExcerpt(initialData.excerpt);
      setCategoryId(initialData.category_id);
      setStatus(initialData.status);
      setFeaturedImage(initialData.featured_image);
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = async (submitStatus: PostStatus) => {
    const formData: PostFormData = {
      title,
      content,
      excerpt,
      category_id: categoryId,
      status: submitStatus,
      featured_image: featuredImage,
    };
    await onSave(formData);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-foreground">
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
        
        <div className="flex gap-3">
          {/* Save as Draft */}
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isLoading || !title}
          >
            <FileText className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          {/* Publish */}
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isLoading || !title || !content}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            {status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="title" className="text-sm font-medium">
                Post Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title..."
                className="mt-2 text-lg font-display"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                placeholder="Write your blog post content here..."
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of your post (shown in listings)..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Leave empty to auto-generate from content.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === 'published' ? 'status-published' : 'status-draft'
              }`}>
                {status === 'published' ? 'Published' : 'Draft'}
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={categoryId || ''} 
                onValueChange={(val) => setCategoryId(val || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Featured Image URL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={featuredImage || ''}
                onChange={(e) => setFeaturedImage(e.target.value || null)}
                placeholder="Enter image URL..."
              />
              {featuredImage && (
                <img 
                  src={featuredImage} 
                  alt="Preview" 
                  className="mt-3 rounded-lg w-full h-32 object-cover"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
