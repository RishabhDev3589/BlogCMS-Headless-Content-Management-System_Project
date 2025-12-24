/**
 * SLUGIFY UTILITY
 * Converts a string into a URL-friendly slug.
 * Example: "My First Blog Post!" -> "my-first-blog-post"
 * 
 * Interview tip: "I created a utility function to generate clean URLs
 * which is important for SEO and user experience."
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()                      // Convert to lowercase
    .trim()                             // Remove whitespace from ends
    .replace(/[^\w\s-]/g, '')          // Remove special characters
    .replace(/[\s_-]+/g, '-')          // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');          // Remove leading/trailing hyphens
}

/**
 * EXCERPT GENERATOR
 * Creates a short preview from HTML content.
 * Strips HTML tags and limits to specified length.
 */
export function generateExcerpt(html: string, maxLength: number = 150): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');

  // Truncate and add ellipsis if needed
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * FORMAT DATE
 * Converts ISO date string to readable format.
 * Example: "2024-01-15T10:30:00" -> "January 15, 2024"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Error';
  }
}
