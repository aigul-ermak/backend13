import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  _id: ObjectId;
  @Prop()
  login: string;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  isMemberShip: boolean;

  static create(name: string, description: string, websiteUrl: string): Blog {
    const blog = new Blog();
    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.createdAt = new Date();
    blog.isMemberShip = true;
    return blog;
  }
}

export const BlogsSchema = SchemaFactory.createForClass(Blog);
