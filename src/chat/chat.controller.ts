import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatResponseDto } from './dto/chat.response.dto';
import { ChatRoom } from 'src/chat-room/chat-room.schema';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Get('/question')
  async getQuestion(@Query('round') round) {
    return this.chatService.castQuestion(round);
  }

  @Get()
  async getChatsByChatRoomId(@Query('chatRoomId') chatRoomId) {
    const chatIds = await this.chatRoomService.getChatIds(chatRoomId);
    return await this.chatService.findBy({ _id: { $in: chatIds } });
  }
}
