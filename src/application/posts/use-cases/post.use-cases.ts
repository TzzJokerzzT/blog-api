import { IPostRepository } from '../../../domain/posts/ports/post-repository.port';
import { GetPostsFilter } from '../../../domain/posts/entities/post.entity';
import { CreatePostInput, UpdatePostInput } from '../post.schema';
import { sanitizeContent, sanitizeText } from '../../../utils/sanitize';

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(data: CreatePostInput, authorId: string) {
    const existingPost = await this.postRepository.findBySlug(data.slug);
    if (existingPost) {
      const error: any = new Error('Ya existe un post con ese slug');
      error.statusCode = 409;
      throw error;
    }

    const sanitizedData = {
      ...data,
      featured: data.featured ?? false,
      title: sanitizeText(data.title),
      excerpt: sanitizeText(data.excerpt),
      content: sanitizeContent(data.content),
      tags: data.tags.map((tag: string) => sanitizeText(tag)),
      category: sanitizeText(data.category),
      author: authorId,
    };

    return this.postRepository.create(sanitizedData);
  }
}

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(filter: GetPostsFilter) {
    return this.postRepository.findAll(filter);
  }
}

export class GetPostBySlugUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(slug: string) {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      const error: any = new Error('Post no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return post;
  }
}

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: string, data: UpdatePostInput, requesterId: string) {
    // Verify the post exists and belongs to the requester
    const post = await this.postRepository.findById(id);
    if (!post) {
      const error: any = new Error('Post no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const authorId =
      typeof post.author === 'object' ? post.author.id : post.author;

    if (authorId !== requesterId) {
      const error: any = new Error('No tienes permiso para editar este post');
      error.statusCode = 403;
      throw error;
    }

    // If slug is changing, check it isn't taken by another post
    if (data.slug && data.slug !== post.slug) {
      const existing = await this.postRepository.findBySlug(data.slug);
      if (existing) {
        const error: any = new Error('Ya existe un post con ese slug');
        error.statusCode = 409;
        throw error;
      }
    }

    // Sanitize only the fields that are being updated
    const sanitizedData: UpdatePostInput = { ...data };
    if (data.title)   sanitizedData.title   = sanitizeText(data.title);
    if (data.excerpt) sanitizedData.excerpt = sanitizeText(data.excerpt);
    if (data.content) sanitizedData.content = sanitizeContent(data.content);
    if (data.tags)    sanitizedData.tags    = data.tags.map((t) => sanitizeText(t));
    if (data.category) sanitizedData.category = sanitizeText(data.category);

    const updated = await this.postRepository.update(id, sanitizedData);
    return updated!;
  }
}

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: string, requesterId: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      const error: any = new Error('Post no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const authorId =
      typeof post.author === 'object' ? post.author.id : post.author;

    if (authorId !== requesterId) {
      const error: any = new Error('No tienes permiso para eliminar este post');
      error.statusCode = 403;
      throw error;
    }

    await this.postRepository.delete(id);
  }
}
