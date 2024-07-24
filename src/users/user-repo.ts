import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user-schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async insert(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
