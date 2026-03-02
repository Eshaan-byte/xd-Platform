import { Router } from 'express';
import * as communityController from '../controllers/communityController.js';

const router = Router();

/**
 * @swagger
 * /api/community:
 *   get:
 *     tags: [Community]
 *     summary: List all community posts
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Community posts retrieved successfully
 */
router.get('/', communityController.listPosts);

/**
 * @swagger
 * /api/community/{slug}:
 *   get:
 *     tags: [Community]
 *     summary: Get community post by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Community post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get('/:slug', communityController.getPostBySlug);

export default router;
