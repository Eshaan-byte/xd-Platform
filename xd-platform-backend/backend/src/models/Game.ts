import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  user: string;
  date: string;
  rating: number;
  text: string;
}

export interface IGameFile {
  s3Key: string;
  s3Url: string;
  size: number;
  uploadDate: Date;
}

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price?: string;
  originalPrice?: string;
  cover: string;
  thumb: string;
  thumbnail: string;
  gallery?: string[];
  publisher?: string;
  releaseDate?: string;
  rating?: number;
  platforms?: string[];
  tags?: string[];
  reviews?: IReview[];
  gameFile?: IGameFile;
  isActive: boolean;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: String, required: true },
    date: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
  },
  { _id: false }
);

const gameFileSchema = new Schema<IGameFile>(
  {
    s3Key: {
      type: String,
      required: true,
    },
    s3Url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const gameSchema = new Schema<IGame>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: String,
    },
    originalPrice: {
      type: String,
    },
    cover: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    publisher: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    platforms: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    gameFile: {
      type: gameFileSchema,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
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

gameSchema.index({ title: 'text', description: 'text' });
gameSchema.index({ isActive: 1, createdAt: -1 });
gameSchema.index({ tags: 1 });

export const Game = mongoose.model<IGame>('Game', gameSchema);
