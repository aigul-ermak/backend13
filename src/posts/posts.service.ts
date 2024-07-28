import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repo';
import { Post } from './posts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs/blogs.schema';
import { Model } from 'mongoose';
import { BlogsRepository } from '../blogs/blogs.repo';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) {
      throw new Error('Blog not found');
    }

    const post = Post.create(
      title,
      shortDescription,
      content,
      blogId,
      blog.name,
    );
    const createdPost = await this.postsRepository.insert(post);

    return {
      id: createdPost._id,
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: blog.name,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ posts: any[]; totalCount: number }> {
    const { posts, totalCount } = await this.postsRepository.findAllPaginated(
      page,
      pageSize,
    );

    const mappedPosts = posts.map((post) => ({
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    }));

    return {
      posts: mappedPosts,
      totalCount,
    };
  }
}
