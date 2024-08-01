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
  ) {
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
    // const blog = await this.blogsService.findById(blogId);
    // if (!blog) {
    //   throw new NotFoundException('Blog not found');
    // }

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
    @Query('page') pageNumber: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const page = parseInt(pageNumber, 10);
    const size = parseInt(pageSize, 10);

    // page = Number(page);
    // pageSize = Number(pageSize);
    const { blogs, totalCount } = await this.blogsService.findAllPaginated(
      page,
      size,
    );
    const pagesCount = Math.ceil(totalCount / size);

    return {
      pagesCount,
      page,
      pageSize: size,
      totalCount,
      items: blogs,
    };
  }

  @Get(':id/posts')
  async getPostsForBlog(
    @Param('id') id: string,
    @Query('page') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    // const pageNumber = parseInt(page, 10);
    // const pageSizeNumber = parseInt(pageSize, 10);

    const blog = await this.blogsService.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const totalCount = await this.postsService.countByBlogId(id);
    const pagesCount = Math.ceil(totalCount / +pageSize);

    const skip = (+pageNumber - 1) * +pageSize;
    const posts = await this.postsService.findByBlogIdPaginated(
      id,
      skip,
      +pageSize,
    );

    //const posts = await this.postsService.findByBlogId(id);
    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: posts.map((post) => ({
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
      })),
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
