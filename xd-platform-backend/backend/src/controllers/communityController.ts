import { Request, Response, NextFunction } from 'express';
import { CommunityService } from '../services/community.service.js';
import { listCommunityDto } from '../dto/community.dto.js';
import { ApiResponseHelper } from '../types/api.js';

const communityService = new CommunityService();

export const listPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = listCommunityDto.parse(req.query);

    const result = await communityService.listPosts(validatedData);

    res.status(200).json(
      ApiResponseHelper.paginated(
        result.posts,
        result.pagination,
        'Community posts retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const post = await communityService.getPostBySlug(slug);

    res.status(200).json(
      ApiResponseHelper.success(post, 'Community post retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};
