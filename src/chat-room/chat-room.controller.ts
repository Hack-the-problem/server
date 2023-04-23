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
  create() {
    return this.chatRoomService.create();
  }

  @Get('/instance')
  getActiveChainInstance() {
    throw Error('chain error');
    return this.langchainService.getChains();
  }
}
