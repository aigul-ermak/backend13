import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: { email: string; login: string; password: string },
  ): Promise<{ id: string; login: string; email: string; createdAt: Date }> {
    return this.userService.create(
      createUserDto.email,
      createUserDto.login,
      createUserDto.password,
    );
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUserById(id);
  }
}
