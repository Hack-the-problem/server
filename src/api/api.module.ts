import { Module } from '@nestjs/common';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatModule } from './chat/chat.module';
import { CommentModule } from './comment/comment.module';
import { ResultModule } from './result/result.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ChatModule, ChatRoomModule, CommentModule, ResultModule, UserModule],
})
export class ApiModule {}
