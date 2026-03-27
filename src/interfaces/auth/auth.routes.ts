import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from '../../application/auth/auth.schema';
import { AuthController } from './auth.controller';
import { MongoUserRepository } from '../../infrastructure/auth/mongo-user.repository';
import {
  RegisterUseCase,
  LoginUseCase,
  RefreshTokensUseCase,
  LogoutUseCase,
} from '../../application/auth/use-cases/auth.use-cases';

// Dependency composition: wire adapters into use cases into controller
const userRepository = new MongoUserRepository();
const authController = new AuthController(
  new RegisterUseCase(userRepository),
  new LoginUseCase(userRepository),
  new RefreshTokensUseCase(userRepository),
  new LogoutUseCase(userRepository)
);

const router = Router();

// POST /api/auth/register
router.post('/register', validate(RegisterSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(LoginSchema), authController.login);

// POST /api/auth/refresh
router.post('/refresh', validate(RefreshTokenSchema), authController.refresh);

// POST /api/auth/logout  (requires auth)
router.post('/logout', authMiddleware, authController.logout);

export default router;
