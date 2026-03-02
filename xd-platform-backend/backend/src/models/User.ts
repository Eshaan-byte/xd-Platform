import mongoose, { Schema, Document } from 'mongoose';

export interface IDownloadedGame {
  gameId: mongoose.Types.ObjectId;
  downloadDate: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firebaseUid?: string;
  email: string;
  password?: string;
  username: string;
  role: 'user' | 'admin';
  downloadedGames: IDownloadedGame[];
  createdAt: Date;
  updatedAt: Date;
}

const downloadedGameSchema = new Schema<IDownloadedGame>(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    downloadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    downloadedGames: {
      type: [downloadedGameSchema],
      default: [],
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

export const User = mongoose.model<IUser>('User', userSchema);
