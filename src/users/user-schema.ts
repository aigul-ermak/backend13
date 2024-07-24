import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  static create(name: string, email: string | null) {
    const user = new User();

    user.name = name;
    user.email = email ?? `${randomUUID()}_${name}@it-incubator.io`;

    return user;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
