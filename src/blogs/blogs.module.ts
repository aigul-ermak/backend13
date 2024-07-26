import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogsSchema } from './blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
  ],
  providers: [BlogsService, BlogsRepository],
  controllers: [BlogsController],
})
export class BlogsModule {}
