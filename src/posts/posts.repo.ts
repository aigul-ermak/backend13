import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './posts.schema';
import { BlogDocument } from '../blogs/blogs.schema';

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

  // async findById(id: string): Promise<Post | null> {
  //   return this.blogModel.findById(id).exec();
  // }
  //
  // async deleteById(id: string): Promise<void> {
  //   await this.blogModel.findByIdAndDelete(id).exec();
  // }
  //
  // async findByName(name: string): Promise<Blog | null> {
  //   return this.blogModel.findOne({ name }).exec();
  // }
  async findById(id: any) {
    return Promise.resolve(id);
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
}
