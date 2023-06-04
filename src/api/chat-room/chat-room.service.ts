import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './chat-room.schema';
import { questionMaps } from './questions';
import { getRandomValues } from 'crypto';
import { getRandomValue } from '../utils/getRandomValue';

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async create(userId): Promise<ChatRoom> {
    return (await this.chatRoomModel.create([{ _id: new Types.ObjectId(), userId }]))[0];
  }

  async findById(id) {
    return await this.chatRoomModel.findById(id).lean();
  }

  async getChatIds(id) {
    return (await this.chatRoomModel.findById(id, { chatIds: 1 }))?.chatIds;
  }

  async addChat(_id, chatId) {
    return await this.chatRoomModel.findOneAndUpdate(
      { _id },
      { $addToSet: { chatIds: chatId } },
      { new: true },
    );
  }

  async updateIsFinished(_id, isFinished) {
    return await this.chatRoomModel.findOneAndUpdate(
      { _id },
      { isFinished },
      { new: true },
      //
    );
  }

  castQuestions() {
    return Object.values(questionMaps).map((questionPair) => getRandomValue(questionPair));
  }

  castQuestion(round) {
    return getRandomValue(questionMaps[round]);
  }
}
