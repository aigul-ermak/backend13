import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repo';
import { Post } from './posts.schema';

@Injectable()
export class PostsService {
  constructor(private postsRepo: PostsRepository) {}

  async create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    //const existingPost = await this.postsRepo.findByName(name);

    const post = Post.create(title, shortDescription, content, blogId);
    const createdBlog = await this.postsRepo.insert(post);

    return await this.postsRepo.findById(createdBlog.id);
  }
}
