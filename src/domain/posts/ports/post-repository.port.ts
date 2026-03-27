import { Post, CreatePostData, UpdatePostData, GetPostsFilter, PaginatedPosts } from '../entities/post.entity';

// Port (interface) that the domain defines for post persistence.
// The infrastructure layer (MongoDB adapter) implements this interface.
export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  findAll(filter: GetPostsFilter): Promise<PaginatedPosts>;
  create(data: CreatePostData): Promise<Post>;
  update(id: string, data: UpdatePostData): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}
