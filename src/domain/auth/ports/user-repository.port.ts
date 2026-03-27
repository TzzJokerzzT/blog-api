import { User, CreateUserData } from '../entities/user.entity';

// Port (interface) that the domain defines for user persistence.
// The infrastructure layer (MongoDB adapter) implements this interface.
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
}
