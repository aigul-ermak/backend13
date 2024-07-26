import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.schema';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  async create(
    @Body()
    createBlogDto: {
      name: string;
      description: string;
      websiteUrl: string;
    },
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
  async getAllBlogs(): Promise<Blog[]> {
    return this.blogsService.findAll();
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
