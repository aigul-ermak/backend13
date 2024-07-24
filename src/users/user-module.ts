import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user-schema';
import { UserService } from './user-service';
import { UserController } from './user-controller';
import { UsersRepository } from './user-repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UsersRepository],
  controllers: [UserController],
})
export class UserModule {}
