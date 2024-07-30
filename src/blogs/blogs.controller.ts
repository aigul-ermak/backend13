import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.schema';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

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
