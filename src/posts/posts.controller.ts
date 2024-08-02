import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Blog } from '../blogs/blogs.schema';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { UpdateBlogDto } from '../blogs/dto/create-blog.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(
    @Body()
    createPostDto: CreatePostDto,
  ) {
    //const { title, shortDescription, content, blogId } = createPostDto;
    const createdPost = await this.postsService.create(createPostDto);

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

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
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

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    const result = await this.postsService.deletePostById(id);
    if (!result) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
  }
}
