import { Injectable } from '@nestjs/common';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}

  async create(
    email: string,
    name: string,
    password: string,
  ): Promise<{ id: string; login: string; email: string; createdAt: Date }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create(name, email, hashedPassword);
    const createdUser = await this.userRepo.create(user);

    return {
      id: createdUser._id.toString(),
      login: createdUser.login,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepo.deleteById(id);
  }
}
