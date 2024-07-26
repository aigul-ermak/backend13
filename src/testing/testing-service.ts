import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blogs/blogs.schema';

@Injectable()
export class TestingService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async clearAllData() {
    await this.blogModel.deleteMany({});
  }
}
