import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatRoom } from './chat-room.schema';

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatService: ChatService,
    private readonly langchainService: LangchainService,
  ) {}

  @Post()
  async create() {
    const newChatRoom = await this.chatRoomService.create();
    return newChatRoom;
  }

  @Post('/chat')
  async addChat(
    @Query('chatRoomId') chatRoomId,
    @Body() { round, question, answer },
  ): Promise<ChatRoom> {
    const newChat = await this.chatService.create(round, question, answer);
    return await this.chatRoomService.addChat(chatRoomId, newChat._id);
  }

  @Get('/instance')
  getActiveChainInstance() {
    return this.langchainService.getChains();
  }
}
