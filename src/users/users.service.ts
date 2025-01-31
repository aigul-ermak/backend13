import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(
    email: string,
    name: string,
    password: string,
  ): Promise<{ id: string; login: string; email: string; createdAt: Date }> {
    // const existingUser = await this.userRepo.findOne(email);
    // if (existingUser) {
    //   throw new ConflictException(`Blog with name "${name}" already exists`);
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create(name, email, hashedPassword);
    const createdUser = await this.usersRepository.create(user);

    return {
      id: createdUser._id.toString(),
      login: createdUser.login,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteById(id);
  }

  async findAllPaginated(
    sort: string,
    direction: 'asc' | 'desc',
    page: number,
    pageSize: number,
    searchLogin: string,
    searchEmail: string,
  ) {
    const { users, totalCount } = await this.usersRepository.findAllPaginated(
      sort,
      direction,
      page,
      pageSize,
      searchLogin,
      searchEmail,
    );

    const mappedUsers = users.map((user) => ({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    }));

    return {
      users: mappedUsers,
      totalCount,
    };
  }
}
