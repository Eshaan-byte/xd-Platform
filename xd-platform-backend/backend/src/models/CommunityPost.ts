import mongoose, { Schema, Document } from 'mongoose';

export interface IRelatedPost {
  title: string;
  image: string;
  slug: string;
  comments: number;
  likes: number;
  author: string;
  date: string;
}

export interface ICommunityPost extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  image: string;
  thumb?: string;
  comments: number;
  likes: number;
  author: string;
  date: string;
  excerpt?: string;
  content: string[];
  more?: IRelatedPost[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const relatedPostSchema = new Schema<IRelatedPost>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true },
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    author: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const communityPostSchema = new Schema<ICommunityPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
    },
    comments: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
    },
    content: {
      type: [String],
      default: [],
    },
    more: {
      type: [relatedPostSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: any, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const CommunityPost = mongoose.model<ICommunityPost>('CommunityPost', communityPostSchema);
