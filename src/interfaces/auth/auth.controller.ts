import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase, LoginUseCase, RefreshTokensUseCase, LogoutUseCase } from '../../application/auth/use-cases/auth.use-cases';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokensUseCase: RefreshTokensUseCase,
    private logoutUseCase: LogoutUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.refreshTokensUseCase.execute(refreshToken);
      res.status(200).json({ success: true, data: tokens });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.logoutUseCase.execute(req.user!.userId);
      res.status(200).json({ success: true, message: 'Sesion cerrada correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
