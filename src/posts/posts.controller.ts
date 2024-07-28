import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Blog } from '../blogs/blogs.schema';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(
    @Body()
    createPostDto: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    },
  ) {
    const { title, shortDescription, content, blogId } = createPostDto;
    const createdPost = await this.postsService.create(
      title,
      shortDescription,
      content,
      blogId,
    );

    return {
      id: createdPost.id,
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: createdPost.extendedLikesInfo,
    };
  }

  @Get()
  async getAllPosts(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Blog[];
  }> {
    page = Number(page);
    pageSize = Number(pageSize);
    const { posts, totalCount } = await this.postsService.findAllPaginated(
      page,
      pageSize,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: posts,
    };
  }
}
