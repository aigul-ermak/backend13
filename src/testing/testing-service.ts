import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class TestingService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async clearAllData() {
    await this.userModel.deleteMany({});
  }
}
