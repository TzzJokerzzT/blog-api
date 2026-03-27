// Domain entity: User
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  createdAt: Date;
}

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'refreshToken'>;
export type PublicUser = Omit<User, 'password' | 'refreshToken'>;
