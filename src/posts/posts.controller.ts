import { Body, Controller, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

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
}
