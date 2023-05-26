import { Body, Controller, Get, InternalServerErrorException, Post, Query } from '@nestjs/common';
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
  async addChat(@Body() { chatRoomId, round, question, answer }): Promise<Chat> {
    const newChatObject = this.chatService.createChatObject({ round, question, answer });
    const [newChat, updatedChatRoom] = await Promise.all([
      this.chatService.create(newChatObject),
      this.chatRoomService.addChat(chatRoomId, newChatObject._id),
    ]);
    if (!updatedChatRoom.chatIds.some((chatId) => chatId !== newChatObject._id))
      throw InternalServerErrorException;
    return newChat;
  }

  @Get()
  async getChatsByChatRoomId(@Query('chatRoomId') chatRoomId) {
    const chatIds = await this.chatRoomService.getChatIds(chatRoomId);
    return await this.chatService.findBy({ _id: { $in: chatIds } });
  }
}
