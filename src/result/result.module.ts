import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './result.schema';
import { LangchainModule } from 'src/langchain/langchain.module';
import { ChatModule } from 'src/chat/chat.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    ChatModule,
    ChatRoomModule,
    LangchainModule,
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
