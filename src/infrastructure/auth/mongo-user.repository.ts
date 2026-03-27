import { IUserRepository } from '../../domain/auth/ports/user-repository.port';
import { User, CreateUserData } from '../../domain/auth/entities/user.entity';
import { UserModel } from './user.model';

// Adapter: implements the IUserRepository port using MongoDB/Mongoose
export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: CreateUserData): Promise<User> {
    const doc = await UserModel.create(data);
    return this.toEntity(doc.toObject());
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshToken });
  }

  private toEntity(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      refreshToken: doc.refreshToken ?? null,
      createdAt: doc.createdAt,
    };
  }
}
