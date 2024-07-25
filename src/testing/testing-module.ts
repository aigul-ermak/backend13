import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestingController } from './testing-controller';
import { TestingService } from './testing-service';

@Module({
  imports: [
    //MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    // Add other models here
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
