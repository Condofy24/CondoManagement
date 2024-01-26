import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://capstone:marioisgay@condofy.drswlo1.mongodb.net/?retryWrites=true&w=majority', // TODO: Move password to env
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
