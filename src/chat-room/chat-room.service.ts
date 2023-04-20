import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schema/chat-room.schema';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async create() {
    return (
      await this.chatRoomModel.create([{ _id: new Types.ObjectId() }])
    )[0];
  }

  async addChat(_id, chat) {
    return this.chatRoomModel.findOneAndUpdate(
      { _id },
      { $addToSet: { chats: chat } },
    );
  }
}
