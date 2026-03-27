import { Schema, model, Document, Types } from 'mongoose';

export interface IPostDocument extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  featured: boolean;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPostDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

postSchema.index({ slug: 1 });
postSchema.index({ category: 1 });
postSchema.index({ featured: 1 });

export const PostModel = model<IPostDocument>('Post', postSchema);
