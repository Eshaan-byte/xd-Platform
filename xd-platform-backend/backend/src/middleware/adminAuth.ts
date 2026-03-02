import { Request, Response, NextFunction } from 'express';
import { ApiResponseHelper } from '../types/api.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('AdminAuthMiddleware');

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.userId || !req.userRole) {
      res.status(401).json(
        ApiResponseHelper.error(
          'Authentication required',
          'User not authenticated'
        )
      );
      return;
    }

    if (req.userRole !== 'admin') {
      logger.warn(
        { userId: req.userId, role: req.userRole },
        'Non-admin user attempted to access admin endpoint'
      );

      res.status(403).json(
        ApiResponseHelper.error(
          'Access denied',
          'Admin privileges required'
        )
      );
      return;
    }

    logger.debug({ userId: req.userId }, 'Admin access granted');

    next();
  } catch (error) {
    logger.error({ error }, 'Admin authorization failed');
    res.status(500).json(
      ApiResponseHelper.error(
        'Authorization failed',
        error instanceof Error ? error.message : 'Unknown error'
      )
    );
  }
};
