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
import { BlogsService } from './blogs.service';
import {
  CreateBlogDto,
  CreatePostToBlogDto,
  UpdateBlogDto,
} from './dto/create-blog.dto';
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
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
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
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
    @Query('sortDirection') sortDirection?: string,
  ) {
    const page = pageNumber ?? 1;
    const size = pageSize ?? 10;
    const direction = sortDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const { blogs, totalCount } = await this.blogsService.findAllPaginated(
      page,
      size,
      direction,
    );
    const pagesCount = Math.ceil(totalCount / size);

    return {
      pagesCount,
      page: +page,
      pageSize: +size,
      totalCount,
      items: blogs,
    };
  }

  @Get(':id/posts')
  async getPostsForBlog(
    @Param('id') id: string,
    @Query('page') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const page = pageNumber ?? 1;
    const size = pageSize ?? 10;
    //const direction = sortDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const blog = await this.blogsService.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const totalCount = await this.postsService.countByBlogId(id);
    const pagesCount = Math.ceil(totalCount / +size);

    const skip = (page - 1) * size;
    const posts = await this.postsService.findByBlogIdPaginated(
      id,
      skip,
      +size,
      //direction,
    );

    //const posts = await this.postsService.findByBlogId(id);
    return {
      pagesCount,
      page: +page,
      pageSize: +size,
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
