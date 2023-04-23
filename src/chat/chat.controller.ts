import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Post()
  async postChatInput(@Body() { chatRoomId, input }): Promise<string> {
    const response = await this.langchainService.getResponse(chatRoomId, input);
    const chatObject = await this.chatService.create(input, response);

    const updatedChatRoom = await this.chatRoomService.addChat(chatRoomId, [chatObject._id]);
    return response;
  }
}
