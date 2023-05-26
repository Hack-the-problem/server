import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './result.schema';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

import { ChatModule } from 'src/api/chat/chat.module';
import { ChatRoomModule } from 'src/api/chat-room/chat-room.module';
import { LangchainModule } from 'src/lib/langchain/langchain.module';

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
