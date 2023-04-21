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
  async postChatInput(@Body() { chatRoomId, input }): Promise<string> {
    const response = await this.chatService.getChatResponse(chatRoomId, input);
    const chatObject = await this.chatService.create(input, response);

    console.log('chatObject', chatObject);
    const updatedChatRoom = await this.chatRoomService.addChat(
      chatRoomId,
      chatObject,
    );
    console.log(
      'chatRoom updated:: ',
      updatedChatRoom,
      'inserted Chat:: ',
      response,
    );
    return response;
  }
}
