import { z } from 'zod';

export const generateUploadUrlDto = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().positive('File size must be positive'),
  uploadType: z.enum(['game', 'thumbnail']),
});

export type GenerateUploadUrlInput = z.infer<typeof generateUploadUrlDto>;

export interface UploadUrlResponseDto {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}
