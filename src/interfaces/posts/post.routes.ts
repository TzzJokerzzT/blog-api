import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { CreatePostSchema, UpdatePostSchema } from '../../application/posts/post.schema';
import { PostController } from './post.controller';
import { MongoPostRepository } from '../../infrastructure/posts/mongo-post.repository';
import {
  CreatePostUseCase,
  GetPostsUseCase,
  GetPostBySlugUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
} from '../../application/posts/use-cases/post.use-cases';

// Dependency composition: wire adapters into use cases into controller
const postRepository = new MongoPostRepository();
const postController = new PostController(
  new CreatePostUseCase(postRepository),
  new GetPostsUseCase(postRepository),
  new GetPostBySlugUseCase(postRepository),
  new UpdatePostUseCase(postRepository),
  new DeletePostUseCase(postRepository)
);

const router = Router();

// GET /api/posts  (public)
router.get('/', postController.getPosts);

// GET /api/posts/:slug  (public)
router.get('/:slug', postController.getPostBySlug);

// POST /api/posts  (requires auth)
router.post('/', authMiddleware, validate(CreatePostSchema), postController.createPost);

// PUT /api/posts/:id  (requires auth + ownership)
router.put('/:id', authMiddleware, validate(UpdatePostSchema), postController.updatePost);

// DELETE /api/posts/:id  (requires auth + ownership)
router.delete('/:id', authMiddleware, postController.deletePost);

export default router;
