import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { LangchainService } from 'src/lib/langchain/langchain.service';
import { JwtAuthGuard } from 'src/api/utils/guard/jwt-auth.guard';

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() request) {
    const user = request.user;
    const newChatRoom = await this.chatRoomService.create(user._id);
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

  @Put()
  async updateChatRoom(@Query('chatRoomId') chatRoomId, @Body() { isFinished }) {
    console.log('isFinished', isFinished);
    return await this.chatRoomService.updateIsFinished(chatRoomId, isFinished);
  }

  @Get('/question')
  async getQuestion(@Query('round') round) {
    return this.chatRoomService.castQuestion(round);
  }

  @Get('/questions')
  async getQuestions() {
    return this.chatRoomService.castQuestions();
  }
}
