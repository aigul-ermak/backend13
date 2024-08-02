import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './posts.schema';
import { BlogDocument } from '../blogs/blogs.schema';
import { UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async insert(post: Post) {
    const res = await this.postModel.insertMany(post);
    return res[0];
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findById(id: any) {
    return this.postModel.findById(id).exec();
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ posts: PostDocument[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const [posts, totalCount] = await Promise.all([
      this.postModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec(), // Sort by createdAt
      this.postModel.countDocuments(),
    ]);
    return { posts, totalCount };
  }

  async deleteById(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }

  async findByBlogId(blogId: string): Promise<PostDocument[]> {
    return this.postModel.find({ blogId }).exec();
  }

  async countByBlogId(blogId: string) {
    return this.postModel.countDocuments({ blogId }).exec();
  }

  async findByBlogIdPaginated(
    blogId: string,
    skip: number,
    limit: number,
  ): Promise<PostDocument[]> {
    return this.postModel
      .find({ blogId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }
}
