import { z } from 'zod';

export const registerDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
});

export const loginDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerDto>;
export type LoginInput = z.infer<typeof loginDto>;

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: 'user' | 'admin';
  };
}
