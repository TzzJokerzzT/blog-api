import { IPostRepository } from '../../domain/posts/ports/post-repository.port';
import {
  Post,
  CreatePostData,
  UpdatePostData,
  GetPostsFilter,
  PaginatedPosts,
} from '../../domain/posts/entities/post.entity';
import { PostModel } from './post.model';

// Adapter: implements the IPostRepository port using MongoDB/Mongoose
export class MongoPostRepository implements IPostRepository {
  async findById(id: string): Promise<Post | null> {
    const doc = await PostModel.findById(id)
      .populate('author', 'name email')
      .lean();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const doc = await PostModel.findOne({ slug })
      .populate('author', 'name email')
      .lean();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findAll(filter: GetPostsFilter): Promise<PaginatedPosts> {
    const { page = 1, limit = 10, category, featured } = filter;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured;

    const [docs, total] = await Promise.all([
      PostModel.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PostModel.countDocuments(query),
    ]);

    return {
      posts: docs.map((doc) => this.toEntity(doc)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreatePostData): Promise<Post> {
    const doc = await PostModel.create(data);
    const populated = await PostModel.findById(doc._id)
      .populate('author', 'name email')
      .lean();
    return this.toEntity(populated!);
  }

  async update(id: string, data: UpdatePostData): Promise<Post | null> {
    const doc = await PostModel.findByIdAndUpdate(id, data, { new: true })
      .populate('author', 'name email')
      .lean();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id);
    return result !== null;
  }

  private toEntity(doc: any): Post {
    const author =
      doc.author && typeof doc.author === 'object' && '_id' in doc.author
        ? { id: doc.author._id.toString(), name: doc.author.name, email: doc.author.email }
        : doc.author?.toString() ?? '';

    return {
      id: doc._id.toString(),
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt,
      content: doc.content,
      date: doc.date,
      readTime: doc.readTime,
      tags: doc.tags,
      category: doc.category,
      featured: doc.featured,
      author,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
