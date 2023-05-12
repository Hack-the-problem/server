import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get()
  async getChatRoom(@Query('chatRoomId') chatRoomId) {
    return await this.chatRoomService.findById(chatRoomId);
  }

  @Post()
  async updateChatRoom(@Query('chatRoomId') chatRoomId, @Body() { isFinished }) {
    return await this.chatRoomService.updateIsFinished(chatRoomId, isFinished);
  }
}
