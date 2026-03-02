import { createModuleLogger } from '../config/logger.js';
import { CommunityRepository } from '../repositories/community.repository.js';
import { CommunityPostResponseDto, ListCommunityInput } from '../dto/community.dto.js';

const logger = createModuleLogger('CommunityService');

export class CommunityService {
  private communityRepository: CommunityRepository;

  constructor() {
    this.communityRepository = new CommunityRepository();
  }

  async listPosts(input: ListCommunityInput) {
    try {
      const skip = (input.page - 1) * input.limit;

      const posts = await this.communityRepository.findAll({
        skip,
        limit: input.limit,
      });

      const total = await this.communityRepository.countAll();

      return {
        posts: posts.map((post) => this.transformPostToDto(post)),
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to list community posts');
      throw error;
    }
  }

  async getPostBySlug(slug: string): Promise<CommunityPostResponseDto> {
    try {
      const post = await this.communityRepository.findBySlug(slug);

      if (!post) {
        throw new Error('Community post not found');
      }

      return this.transformPostToDto(post);
    } catch (error) {
      logger.error({ error, slug }, 'Failed to get community post');
      throw error;
    }
  }

  private transformPostToDto(post: any): CommunityPostResponseDto {
    return {
      id: post._id.toString(),
      slug: post.slug,
      title: post.title,
      image: post.image,
      thumb: post.thumb,
      comments: post.comments,
      likes: post.likes,
      author: post.author,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content || [],
      more: (post.more || []).map((m: any) => ({
        title: m.title,
        image: m.image,
        slug: m.slug,
        comments: m.comments,
        likes: m.likes,
        author: m.author,
        date: m.date,
      })),
      featured: post.featured,
    };
  }
}
