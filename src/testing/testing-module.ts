import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/user-schema';
import { TestingController } from './testing-controller';
import { TestingService } from './testing-service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Add other models here
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
