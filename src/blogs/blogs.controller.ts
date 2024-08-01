import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.schema';
import { CreateBlogDto, CreatePostToBlogDto } from './dto/create-blog.dto';
import { PostsService } from '../posts/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
  ) {}

  @Post()
  async create(
    @Body()
    createBlogDto: CreateBlogDto,
  ): Promise<{
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
  }> {
    const { name, description, websiteUrl } = createBlogDto;
    const createdBlog = await this.blogsService.create(
      name,
      description,
      websiteUrl,
    );

    return {
      id: createdBlog!._id.toString(),
      name: createdBlog!.name,
      description: createdBlog!.description,
      websiteUrl: createdBlog!.websiteUrl,
      createdAt: createdBlog!.createdAt,
      isMembership: createdBlog!.isMembership,
    };
  }

  @Post(':id/posts')
  async createPost(
    @Param('id') blogId: string,
    @Body()
    createPostToBlogDto: CreatePostToBlogDto,
  ) {
    const blog = await this.blogsService.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const createdPost = await this.postsService.create({
      ...createPostToBlogDto,
      blogId,
    });

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
  async getAllBlogs(
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
    const { blogs, totalCount } = await this.blogsService.findAllPaginated(
      page,
      pageSize,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: blogs,
    };
  }

  @Get(':id/posts')
  async getPostsForBlog(@Param('id') id: string) {
    const posts = await this.postsService.findByBlogId(id);
    return posts.map((post) => ({
      id: post._id.toString(),
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
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogsService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogsService.deleteBlogById(id);
  }
}
