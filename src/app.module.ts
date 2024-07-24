import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user-module';
import { TestingModule } from '@nestjs/testing';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    DatabaseModule,
    UserModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
