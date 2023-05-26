import { Body, Controller, Get, InternalServerErrorException, Post, Query } from '@nestjs/common';
import { Chat } from './chat.schema';
import { ChatService } from './chat.service';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
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
