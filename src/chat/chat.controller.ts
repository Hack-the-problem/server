import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post()
  async createChat(@Body() { chatRoomId, round, answer }): Promise<ChatRoom> {
    const question = this.chatService.castQuestion(round);
    const newChat = await this.chatService.create(round, question, answer);
    console.log('newChat', newChat);
    return await this.chatRoomService.addChat(chatRoomId, newChat._id);
  }

  @Get()
  async getChatsBy(@Query('chatRoomId') chatRoomId) {
    const chatIds = await this.chatRoomService.getChatIds(chatRoomId);
    const chats = await this.chatService.findBy({ _id: { $in: chatIds } });
    return chats;
  }
}
