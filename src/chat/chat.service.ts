import { Injectable } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    private readonly langchainService: LangchainService,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  async create(chatObject) {
    return (await this.chatModel.create([chatObject]))[0];
  }

  createChatObject({ round, question, answer }) {
    return {
      _id: new Types.ObjectId(),
      round,
      question,
      answer,
    };
  }

  async findById(id) {
    return await this.chatModel.findById(id).lean();
  }

  async findBy(filter) {
    return await this.chatModel.find(filter).lean();
  }
}
