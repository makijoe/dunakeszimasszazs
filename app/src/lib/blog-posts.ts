import rawPosts from '@/data/blog-posts.json';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  /** Related treatment slug from services.ts */
  serviceId?: string;
  seoTitle: string;
  seoDescription: string;
  blocks: BlogBlock[];
};

export const BLOG_INDEX_PATH = '/blog';

export function getBlogPath(slug: string): string {
  return `/blog/${slug}`;
}

export const blogPosts: BlogPost[] = rawPosts as BlogPost[];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsSorted(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getBlogPostByServiceId(serviceId: string): BlogPost | undefined {
  return blogPosts.find((post) => post.serviceId === serviceId);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getBlogPostsSorted()
    .filter((p) => p.slug !== post.slug)
    .slice(0, limit);
}

/** Plain text length helper for SEO checks */
export function countBlogWords(post: BlogPost): number {
  const parts = [
    post.title,
    post.excerpt,
    ...post.blocks.flatMap((b) => {
      if (b.type === 'p' || b.type === 'h2') return [b.text];
      if (b.type === 'ul') return b.items;
      return [];
    }),
  ];
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}
