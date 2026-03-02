import { Router, Request, Response } from 'express';
import authRoutes from './auth.js';
import gamesRoutes from './games.js';
import communityRoutes from './community.js';
import adminRoutes from './admin.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { ApiResponseHelper } from '../types/api.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json(
    ApiResponseHelper.success(
      {
        status: 'healthy',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      'API is running'
    )
  );
});

router.use('/auth', authRoutes);
router.use('/games', apiLimiter, gamesRoutes);
router.use('/community', apiLimiter, communityRoutes);
router.use('/admin', apiLimiter, adminRoutes);

export default router;
