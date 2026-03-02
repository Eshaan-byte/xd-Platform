import mongoose from 'mongoose';
import { createModuleLogger } from '../config/logger.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserResponseDto, UpdateUserInput } from '../dto/user.dto.js';

const logger = createModuleLogger('UserService');

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(
    userId: mongoose.Types.ObjectId
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid || '',
        email: user.email,
        username: user.username,
        role: user.role,
        downloadedGames: user.downloadedGames.map((game) => ({
          gameId: game.gameId.toString(),
          downloadDate: game.downloadDate.toISOString(),
        })),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get user');
      throw error;
    }
  }

  async updateUser(
    userId: mongoose.Types.ObjectId,
    updates: UpdateUserInput
  ): Promise<UserResponseDto> {
    try {
      logger.info({ userId }, 'Updating user');

      const updatedUser = await this.userRepository.updateById(userId, updates);

      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info({ userId }, 'User updated successfully');

      return {
        id: updatedUser._id.toString(),
        firebaseUid: updatedUser.firebaseUid,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        downloadedGames: updatedUser.downloadedGames.map((game) => ({
          gameId: game.gameId.toString(),
          downloadDate: game.downloadDate.toISOString(),
        })),
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to update user');
      throw error;
    }
  }

  async getUserDownloadHistory(
    userId: mongoose.Types.ObjectId
  ): Promise<UserResponseDto['downloadedGames']> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return user.downloadedGames.map((game) => ({
        gameId: game.gameId.toString(),
        downloadDate: game.downloadDate.toISOString(),
      }));
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get download history');
      throw error;
    }
  }
}
