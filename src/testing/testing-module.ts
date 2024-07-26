import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestingController } from './testing-controller';
import { TestingService } from './testing-service';
import { Blog, BlogsSchema } from '../blogs/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
