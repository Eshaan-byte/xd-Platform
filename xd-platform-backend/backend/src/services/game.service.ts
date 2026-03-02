import mongoose from 'mongoose';
import { createModuleLogger } from '../config/logger.js';
import { GameRepository } from '../repositories/game.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import {
  CreateGameInput,
  UpdateGameInput,
  GameResponseDto,
  ListGamesInput,
} from '../dto/game.dto.js';

const logger = createModuleLogger('GameService');

export class GameService {
  private gameRepository: GameRepository;
  private userRepository: UserRepository;

  constructor() {
    this.gameRepository = new GameRepository();
    this.userRepository = new UserRepository();
  }

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  async createGame(input: CreateGameInput): Promise<GameResponseDto> {
    try {
      logger.info({ title: input.title }, 'Creating new game');

      const slug = input.slug || this.slugify(input.title);

      const gameData: any = {
        title: input.title,
        slug,
        description: input.description || '',
        price: input.price,
        originalPrice: input.originalPrice,
        cover: input.cover,
        thumb: input.thumb,
        thumbnail: input.thumb,
        gallery: input.gallery || [],
        publisher: input.publisher,
        releaseDate: input.releaseDate,
        rating: input.rating,
        platforms: input.platforms || [],
        tags: input.tags || [],
        reviews: input.reviews || [],
        isActive: true,
      };

      // Add S3 game file if provided
      if (input.gameFileKey && input.gameFileUrl && input.gameFileSize) {
        gameData.gameFile = {
          s3Key: input.gameFileKey,
          s3Url: input.gameFileUrl,
          size: input.gameFileSize,
        };
      }

      const game = await this.gameRepository.create(gameData);

      logger.info({ gameId: game._id }, 'Game created successfully');

      return this.transformGameToDto(game);
    } catch (error) {
      logger.error({ error }, 'Failed to create game');
      throw error;
    }
  }

  async getGameById(gameId: mongoose.Types.ObjectId): Promise<GameResponseDto> {
    try {
      const game = await this.gameRepository.findById(gameId);

      if (!game) {
        throw new Error('Game not found');
      }

      return this.transformGameToDto(game);
    } catch (error) {
      logger.error({ error, gameId }, 'Failed to get game');
      throw error;
    }
  }

  async getGameBySlug(slug: string): Promise<GameResponseDto> {
    try {
      const game = await this.gameRepository.findBySlug(slug);

      if (!game) {
        throw new Error('Game not found');
      }

      return this.transformGameToDto(game);
    } catch (error) {
      logger.error({ error, slug }, 'Failed to get game by slug');
      throw error;
    }
  }

  async listGames(input: ListGamesInput, includeInactive: boolean = false) {
    try {
      const skip = (input.page - 1) * input.limit;

      const games = await this.gameRepository.findAll({
        skip,
        limit: input.limit,
        isActive: includeInactive ? undefined : true,
        search: input.search,
        tag: input.tag,
      });

      const total = await this.gameRepository.countAll({
        isActive: includeInactive ? undefined : true,
        search: input.search,
        tag: input.tag,
      });

      return {
        games: games.map((game) => this.transformGameToDto(game)),
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to list games');
      throw error;
    }
  }

  async updateGame(
    gameId: mongoose.Types.ObjectId,
    updates: UpdateGameInput
  ): Promise<GameResponseDto> {
    try {
      logger.info({ gameId }, 'Updating game');

      const updatedGame = await this.gameRepository.updateById(gameId, updates as any);

      if (!updatedGame) {
        throw new Error('Game not found');
      }

      logger.info({ gameId }, 'Game updated successfully');

      return this.transformGameToDto(updatedGame);
    } catch (error) {
      logger.error({ error, gameId }, 'Failed to update game');
      throw error;
    }
  }

  async deleteGame(gameId: mongoose.Types.ObjectId): Promise<void> {
    try {
      logger.info({ gameId }, 'Deleting game');

      const game = await this.gameRepository.findById(gameId);

      if (!game) {
        throw new Error('Game not found');
      }

      // Delete S3 files if they exist
      if (game.gameFile?.s3Key) {
        try {
          const { deleteFile } = await import('../config/s3.js');
          await deleteFile(game.gameFile.s3Key);
          await deleteFile(game.thumbnail?.split('/').pop() || '');
        } catch (error) {
          logger.warn({ error }, 'Failed to delete S3 files (may not be configured)');
        }
      }

      await this.gameRepository.deleteById(gameId);

      logger.info({ gameId }, 'Game deleted successfully');
    } catch (error) {
      logger.error({ error, gameId }, 'Failed to delete game');
      throw error;
    }
  }

  async getDownloadUrl(
    gameId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ): Promise<string> {
    try {
      logger.info({ gameId, userId }, 'Generating download URL');

      const game = await this.gameRepository.findById(gameId);

      if (!game) {
        throw new Error('Game not found');
      }

      if (!game.isActive) {
        throw new Error('Game is not active');
      }

      if (!game.gameFile?.s3Key) {
        throw new Error('No game file available for download');
      }

      const { env } = await import('../config/env.js');
      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const { getS3Client } = await import('../config/s3.js');

      const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: game.gameFile.s3Key,
      });

      const downloadUrl = await getSignedUrl(getS3Client(), command, {
        expiresIn: 3600,
      });

      await this.gameRepository.incrementDownloads(gameId);

      const hasDownloaded = await this.userRepository.hasDownloadedGame(
        userId,
        gameId
      );

      if (!hasDownloaded) {
        await this.userRepository.addDownloadedGame(userId, gameId);
      }

      logger.info({ gameId, userId }, 'Download URL generated successfully');

      return downloadUrl;
    } catch (error) {
      logger.error({ error, gameId }, 'Failed to generate download URL');
      throw error;
    }
  }

  private transformGameToDto(game: any): GameResponseDto {
    return {
      id: game._id.toString(),
      title: game.title,
      slug: game.slug,
      description: game.description || '',
      price: game.price,
      originalPrice: game.originalPrice,
      cover: game.cover,
      thumb: game.thumb,
      gallery: game.gallery || [],
      publisher: game.publisher,
      releaseDate: game.releaseDate,
      rating: game.rating,
      platforms: game.platforms || [],
      tags: game.tags || [],
      reviews: (game.reviews || []).map((r: any) => ({
        user: r.user,
        date: r.date,
        rating: r.rating,
        text: r.text,
      })),
      isActive: game.isActive,
      downloads: game.downloads,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
    };
  }
}
