import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './posts.schema';

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
}
