import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  @Post()
  postChatInput(@Body() { chatRoomId, input }): Promise<string> {
    const response = this.chatService.getChatResponse(chatRoomId, input);
    const updatedChatRoom = this.chatRoomService.addChat(chatRoomId, {
      input,
      response,
    });
    return response;
  }
}
