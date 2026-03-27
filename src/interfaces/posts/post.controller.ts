import { Request, Response, NextFunction } from 'express';
import {
  CreatePostUseCase,
  GetPostsUseCase,
  GetPostBySlugUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
} from '../../application/posts/use-cases/post.use-cases';

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getPostsUseCase: GetPostsUseCase,
    private getPostBySlugUseCase: GetPostBySlugUseCase,
    private updatePostUseCase: UpdatePostUseCase,
    private deletePostUseCase: DeletePostUseCase
  ) {}

  createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.createPostUseCase.execute(req.body, req.user!.userId);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string | undefined;
      const featured =
        req.query.featured !== undefined
          ? String(req.query.featured) === 'true'
          : undefined;

      const result = await this.getPostsUseCase.execute({ page, limit, category, featured });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPostBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.getPostBySlugUseCase.execute(String(req.params.slug));
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.updatePostUseCase.execute(
        String(req.params.id),
        req.body,
        req.user!.userId
      );
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deletePostUseCase.execute(String(req.params.id), req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
