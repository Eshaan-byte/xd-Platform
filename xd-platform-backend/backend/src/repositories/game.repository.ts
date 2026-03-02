import mongoose from 'mongoose';
import { Game, IGame } from '../models/Game.js';

export class GameRepository {
  async findById(id: mongoose.Types.ObjectId): Promise<IGame | null> {
    return await Game.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<IGame | null> {
    return await Game.findOne({ slug }).exec();
  }

  async findAll(options?: {
    skip?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
    tag?: string;
  }): Promise<IGame[]> {
    const query: any = {};

    if (options?.isActive !== undefined) {
      query.isActive = options.isActive;
    }

    if (options?.search) {
      query.$text = { $search: options.search };
    }

    if (options?.tag) {
      query.tags = options.tag;
    }

    const dbQuery = Game.find(query).sort({ createdAt: -1 });

    if (options?.skip) {
      dbQuery.skip(options.skip);
    }

    if (options?.limit) {
      dbQuery.limit(options.limit);
    }

    return await dbQuery.exec();
  }

  async create(gameData: Partial<IGame>): Promise<IGame> {
    const game = new Game(gameData);
    return await game.save();
  }

  async updateById(
    id: mongoose.Types.ObjectId,
    updates: Partial<IGame>
  ): Promise<IGame | null> {
    return await Game.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).exec();
  }

  async incrementDownloads(
    id: mongoose.Types.ObjectId
  ): Promise<IGame | null> {
    return await Game.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    ).exec();
  }

  async deleteById(id: mongoose.Types.ObjectId): Promise<IGame | null> {
    return await Game.findByIdAndDelete(id).exec();
  }

  async countAll(options?: {
    isActive?: boolean;
    search?: string;
    tag?: string;
  }): Promise<number> {
    const query: any = {};

    if (options?.isActive !== undefined) {
      query.isActive = options.isActive;
    }

    if (options?.search) {
      query.$text = { $search: options.search };
    }

    if (options?.tag) {
      query.tags = options.tag;
    }

    return await Game.countDocuments(query).exec();
  }

  async toggleActive(
    id: mongoose.Types.ObjectId,
    isActive: boolean
  ): Promise<IGame | null> {
    return await Game.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    ).exec();
  }
}
