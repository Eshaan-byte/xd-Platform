import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { GameService } from '../services/game.service.js';
import { listGamesDto } from '../dto/game.dto.js';
import { ApiResponseHelper } from '../types/api.js';

const gameService = new GameService();

export const listGames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = listGamesDto.parse(req.query);

    const result = await gameService.listGames(validatedData, false);

    res.status(200).json(
      ApiResponseHelper.paginated(
        result.games,
        result.pagination,
        'Games retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gameId = new mongoose.Types.ObjectId(req.params.id as string);

    const game = await gameService.getGameById(gameId);

    res.status(200).json(
      ApiResponseHelper.success(game, 'Game retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getGameBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const game = await gameService.getGameBySlug(slug);

    res.status(200).json(
      ApiResponseHelper.success(game, 'Game retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getDownloadUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(
        ApiResponseHelper.error('Authentication required', 'User not authenticated')
      );
      return;
    }

    const gameId = new mongoose.Types.ObjectId(req.params.id as string);

    const downloadUrl = await gameService.getDownloadUrl(gameId, req.userId);

    res.status(200).json(
      ApiResponseHelper.success(
        { downloadUrl },
        'Download URL generated successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};
