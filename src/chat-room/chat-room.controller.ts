import { Controller, Get, Post } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Post()
  async create() {
    const newChatRoom = await this.chatRoomService.create();
    return newChatRoom;
  }

  @Get('/instance')
  getActiveChainInstance() {
    return this.langchainService.getChains();
  }
}
