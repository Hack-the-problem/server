import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatResponseDto } from './dto/chat.response.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Post()
  async postChatInput(@Body() { chatRoomId, input }): Promise<ChatResponseDto> {
    const response = await this.langchainService.getResponse(chatRoomId, input);
    const chatObject = await this.chatService.create(input, response);

    const updatedChatRoom = await this.chatRoomService.addChat(chatRoomId, [chatObject._id]);

    return { stage: 1, isFinished: false, data: response };
  }

  @Get()
  async getChatsBy(@Query('chatRoomId') chatRoomId) {
    const chatIds = await this.chatRoomService.getChatIds(chatRoomId);
    const chats = await this.chatService.findBy({ _id: { $in: chatIds } });
    return chats;
  }
}
