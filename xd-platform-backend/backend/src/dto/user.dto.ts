import { z } from 'zod';

export const updateUserDto = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserDto>;

export interface UserResponseDto {
  id: string;
  firebaseUid?: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  downloadedGames: Array<{
    gameId: string;
    downloadDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
