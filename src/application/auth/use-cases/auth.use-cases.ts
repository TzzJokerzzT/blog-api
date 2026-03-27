import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/auth/ports/user-repository.port';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../../utils/jwt';
import { LoginInput, RegisterInput } from '../auth.schema';

const SALT_ROUNDS = 12;

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      const error: any = new Error('El email ya esta registrado');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  }
}

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      const error: any = new Error('Credenciales invalidas');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      const error: any = new Error('Credenciales invalidas');
      error.statusCode = 401;
      throw error;
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  }
}

export class RefreshTokensUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(token: string) {
    const payload = verifyRefreshToken(token);

    const user = await this.userRepository.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      const error: any = new Error('Refresh token invalido');
      error.statusCode = 403;
      throw error;
    }

    const newPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(newPayload);
    const refreshToken = generateRefreshToken(newPayload);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}

export class LogoutUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }
}
