import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/upload-url:
 *   post:
 *     tags: [Admin]
 *     summary: Generate pre-signed upload URL
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *               - fileSize
 *               - uploadType
 *             properties:
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *               fileSize:
 *                 type: number
 *               uploadType:
 *                 type: string
 *                 enum: [game, thumbnail]
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *       403:
 *         description: Admin privileges required
 */
router.post(
  '/upload-url',
  uploadLimiter,
  adminController.generateUploadUrl
);

/**
 * @swagger
 * /api/admin/games:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new game
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - thumbnailKey
 *               - thumbnailUrl
 *               - gameFileKey
 *               - gameFileUrl
 *               - gameFileSize
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnailKey:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *               gameFileKey:
 *                 type: string
 *               gameFileUrl:
 *                 type: string
 *               gameFileSize:
 *                 type: number
 *     responses:
 *       201:
 *         description: Game created successfully
 *       403:
 *         description: Admin privileges required
 */
router.post('/games', adminController.createGame);

/**
 * @swagger
 * /api/admin/games:
 *   get:
 *     tags: [Admin]
 *     summary: List all games (including inactive)
 *     security:
 *       - BearerAuth: []
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
 *       403:
 *         description: Admin privileges required
 */
router.get('/games', adminController.listAllGames);

/**
 * @swagger
 * /api/admin/games/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a game
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Game updated successfully
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: Game not found
 */
router.put('/games/:id', adminController.updateGame);

/**
 * @swagger
 * /api/admin/games/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a game
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
 *         description: Game deleted successfully
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: Game not found
 */
router.delete('/games/:id', adminController.deleteGame);

export default router;
