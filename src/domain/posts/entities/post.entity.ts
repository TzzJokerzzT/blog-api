// Domain entity: Post

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  featured: boolean;
  author: string | { id: string; name: string; email: string };
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePostData = Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & {
  author: string;
};

export type UpdatePostData = Partial<Omit<Post, 'id' | 'author' | 'createdAt' | 'updatedAt'>>;

export interface GetPostsFilter {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}

export interface PaginatedPosts {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
