import { Injectable } from '@nestjs/common';
import { User } from './user-schema';
import { UsersRepository } from './user-repo';

@Injectable()
export class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async create(email: string, name: string): Promise<User> {
    const user = User.create(name, email);
    return this.usersRepository.insert(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
