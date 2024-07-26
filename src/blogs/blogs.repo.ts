import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blogs.schema';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async insert(blog: Blog) {
    const res: BlogDocument[] = await this.blogModel.insertMany(blog);
    return res[0];
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.blogModel.findByIdAndDelete(id).exec();
  }

  async findByName(name: string): Promise<Blog | null> {
    return this.blogModel.findOne({ name }).exec();
  }
}
