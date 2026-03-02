import { z } from 'zod';

export const createGameDto = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  slug: z.string().optional(),
  description: z.string().optional().default(''),
  price: z.string().optional(),
  originalPrice: z.string().optional(),
  cover: z.string().min(1, 'Cover image is required'),
  thumb: z.string().min(1, 'Thumbnail is required'),
  gallery: z.array(z.string()).optional().default([]),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  platforms: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  reviews: z.array(z.object({
    user: z.string(),
    date: z.string(),
    rating: z.number().min(1).max(5),
    text: z.string(),
  })).optional().default([]),
  // S3 game file (optional)
  thumbnailKey: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  gameFileKey: z.string().optional(),
  gameFileUrl: z.string().optional(),
  gameFileSize: z.number().optional(),
});

export const updateGameDto = z.object({
  title: z.string().max(200).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  originalPrice: z.string().optional(),
  cover: z.string().optional(),
  thumb: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  platforms: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const listGamesDto = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('12').transform(Number),
  search: z.string().optional(),
  tag: z.string().optional(),
});

export type CreateGameInput = z.infer<typeof createGameDto>;
export type UpdateGameInput = z.infer<typeof updateGameDto>;
export type ListGamesInput = z.infer<typeof listGamesDto>;

export interface GameResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  price?: string;
  originalPrice?: string;
  cover: string;
  thumb: string;
  gallery: string[];
  publisher?: string;
  releaseDate?: string;
  rating?: number;
  platforms: string[];
  tags: string[];
  reviews: Array<{
    user: string;
    date: string;
    rating: number;
    text: string;
  }>;
  isActive: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}
