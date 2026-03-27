import { Schema, model, Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  refreshToken?: string | null;
  createdAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
