import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from './blogs.schema';
import { BlogsRepository } from './blogs.repo';

@Injectable()
export class BlogsService {
  constructor(private blogsRepo: BlogsRepository) {}

  async create(name: string, description: string, websiteUrl: string) {
    // const existingBlog = await this.blogsRepo.findByName(name);
    // if (existingBlog) {
    //   throw new BadRequestException(`Blog with name "${name}" already exists`);
    //   // throw new HttpException(`Blog with name "${name}" already exists`, 400);
    // }

    const blog = Blog.create(name, description, websiteUrl);
    const createdBlog = await this.blogsRepo.insert(blog);

    return await this.blogsRepo.findById(createdBlog.id);
  }

  async findAll(): Promise<Blog[]> {
    return this.blogsRepo.findAll();
  }

  async findById(id: string) {
    const blog = await this.blogsRepo.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  async deleteBlogById(id: string): Promise<void> {
    await this.blogsRepo.deleteById(id);
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ blogs: any[]; totalCount: number }> {
    const { blogs, totalCount } = await this.blogsRepo.findAllPaginated(
      page,
      pageSize,
    );

    const mappedBlogs = blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }));

    return {
      blogs: mappedBlogs,
      totalCount,
    };
  }
}
