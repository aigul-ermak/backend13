import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user-service';
import { User } from './user-schema';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: { email: string; name: string },
  ): Promise<User> {
    return this.userService.create(createUserDto.email, createUserDto.name);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
