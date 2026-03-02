import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags: [Games]
 *     summary: List all active games
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Games retrieved successfully
 */
router.get('/', gameController.listGames);

/**
 * @swagger
 * /api/games/slug/{slug}:
 *   get:
 *     tags: [Games]
 *     summary: Get game by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game retrieved successfully
 *       404:
 *         description: Game not found
 */
router.get('/slug/:slug', gameController.getGameBySlug);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Get game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game retrieved successfully
 *       404:
 *         description: Game not found
 */
router.get('/:id', gameController.getGameById);

/**
 * @swagger
 * /api/games/{id}/download:
 *   get:
 *     tags: [Games]
 *     summary: Get download URL for a game
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download URL generated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Game not found
 */
router.get('/:id/download', authenticateToken, gameController.getDownloadUrl);

export default router;
