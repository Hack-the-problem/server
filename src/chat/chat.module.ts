import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { LangchainModule } from 'src/langchain/langchain.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports: [LangchainModule, ChatRoomModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
