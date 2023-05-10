import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';
import { Chat } from './chat.schema';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Post()
  async addChat(@Query('chatRoomId') chatRoomId, @Body() createChatDto): Promise<Chat> {
    const newChatObject = this.chatService.createChatObject(createChatDto);
    const [newChat, updatedChatRoom] = await Promise.all([
      await this.chatService.create(newChatObject),
      await this.chatRoomService.addChat(chatRoomId, newChatObject._id),
    ]);
    return newChat;
  }

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
