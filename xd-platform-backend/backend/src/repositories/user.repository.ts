import mongoose from 'mongoose';
import { User, IUser } from '../models/User.js';

export class UserRepository {
  async findById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async findByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
    return await User.findOne({ firebaseUid }).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  async create(userData: {
    firebaseUid?: string;
    email: string;
    password?: string;
    username: string;
    role?: 'user' | 'admin';
  }): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async updateById(
    id: mongoose.Types.ObjectId,
    updates: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).exec();
  }

  async addDownloadedGame(
    userId: mongoose.Types.ObjectId,
    gameId: mongoose.Types.ObjectId
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          downloadedGames: {
            gameId,
            downloadDate: new Date(),
          },
        },
      },
      { new: true }
    ).exec();
  }

  async hasDownloadedGame(
    userId: mongoose.Types.ObjectId,
    gameId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const user = await User.findOne({
      _id: userId,
      'downloadedGames.gameId': gameId,
    }).exec();

    return user !== null;
  }

  async deleteById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).exec();
  }

  async findAll(options?: {
    skip?: number;
    limit?: number;
  }): Promise<IUser[]> {
    const query = User.find();

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    return await query.exec();
  }

  async countAll(): Promise<number> {
    return await User.countDocuments().exec();
  }
}
