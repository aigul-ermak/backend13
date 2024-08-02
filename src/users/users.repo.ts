import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, SortOrder } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    try {
      await this.userModel.collection.dropIndex('email_1');
    } catch (err) {
      if (err.code !== 27) {
        // 27 = IndexNotFound
        throw err;
      }
    }
  }
  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findAllPaginated(
    sort: string,
    direction: 'asc' | 'desc',
    page: number,
    pageSize: number,
    searchLoginTerm?: string,
    searchEmailTerm?: string,
  ): Promise<{ users: User[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const sortOption: { [key: string]: SortOrder } = {
      [sort]: direction === 'asc' ? 1 : -1,
    };

    const searchFilters: any = {};
    if (searchLoginTerm) {
      searchFilters.login = new RegExp(searchLoginTerm, 'i');
    }
    if (searchEmailTerm) {
      searchFilters.email = new RegExp(searchEmailTerm, 'i');
    }

    const [users, totalCount] = await Promise.all([
      this.userModel
        .find(searchFilters)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.userModel.countDocuments(searchFilters),
    ]);

    return { users, totalCount };
  }
}
