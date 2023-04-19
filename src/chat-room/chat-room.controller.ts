import { Controller, Post } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  create() {
    return this.chatRoomService.create();
  }
}
