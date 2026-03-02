import { CommunityPost, ICommunityPost } from '../models/CommunityPost.js';

export class CommunityRepository {
  async findBySlug(slug: string): Promise<ICommunityPost | null> {
    return await CommunityPost.findOne({ slug }).exec();
  }

  async findAll(options?: {
    skip?: number;
    limit?: number;
  }): Promise<ICommunityPost[]> {
    const query = CommunityPost.find().sort({ createdAt: -1 });

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    return await query.exec();
  }

  async countAll(): Promise<number> {
    return await CommunityPost.countDocuments().exec();
  }

  async create(postData: Partial<ICommunityPost>): Promise<ICommunityPost> {
    const post = new CommunityPost(postData);
    return await post.save();
  }
}
