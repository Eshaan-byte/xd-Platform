import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { GameService } from '../services/game.service.js';
import { UploadService } from '../services/upload.service.js';
import {
  createGameDto,
  updateGameDto,
  listGamesDto,
} from '../dto/game.dto.js';
import { generateUploadUrlDto } from '../dto/upload.dto.js';
import { ApiResponseHelper } from '../types/api.js';

const gameService = new GameService();
const uploadService = new UploadService();

export const generateUploadUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = generateUploadUrlDto.parse(req.body);

    const result = await uploadService.generateUploadUrl(validatedData);

    res.status(200).json(
      ApiResponseHelper.success(result, 'Upload URL generated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createGameDto.parse(req.body);

    const game = await gameService.createGame(validatedData);

    res.status(201).json(
      ApiResponseHelper.success(game, 'Game created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const listAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = listGamesDto.parse(req.query);

    const result = await gameService.listGames(validatedData, true);

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

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gameId = new mongoose.Types.ObjectId(req.params.id as string);
    const validatedData = updateGameDto.parse(req.body);

    const game = await gameService.updateGame(gameId, validatedData);

    res.status(200).json(
      ApiResponseHelper.success(game, 'Game updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gameId = new mongoose.Types.ObjectId(req.params.id as string);

    await gameService.deleteGame(gameId);

    res.status(200).json(
      ApiResponseHelper.success(null, 'Game deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
