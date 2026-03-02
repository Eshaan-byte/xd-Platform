import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../config/jwt.js';
import { createModuleLogger } from '../config/logger.js';
import { ApiResponseHelper } from '../types/api.js';

const logger = createModuleLogger('AuthMiddleware');

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(
        ApiResponseHelper.error(
          'Authentication required',
          'No token provided'
        )
      );
      return;
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = verifyToken(token);

    req.userId = new mongoose.Types.ObjectId(decoded.userId);
    req.userRole = decoded.role as 'user' | 'admin';

    logger.debug({ userId: decoded.userId }, 'User authenticated successfully');

    next();
  } catch (error) {
    logger.error({ error }, 'Authentication failed');
    res.status(401).json(
      ApiResponseHelper.error(
        'Authentication failed',
        error instanceof Error ? error.message : 'Invalid token'
      )
    );
  }
};
