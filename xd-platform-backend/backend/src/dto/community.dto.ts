import { z } from 'zod';

export const listCommunityDto = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
});

export type ListCommunityInput = z.infer<typeof listCommunityDto>;

export interface CommunityPostResponseDto {
  id: string;
  slug: string;
  title: string;
  image: string;
  thumb?: string;
  comments: number;
  likes: number;
  author: string;
  date: string;
  excerpt?: string;
  content: string[];
  more?: Array<{
    title: string;
    image: string;
    slug: string;
    comments: number;
    likes: number;
    author: string;
    date: string;
  }>;
  featured: boolean;
}
