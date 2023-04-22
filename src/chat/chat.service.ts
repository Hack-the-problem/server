import { Injectable } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    private readonly langchainService: LangchainService,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  async create(input, response) {
    return (await this.chatModel.create([{ input, response }]))[0];
  }
}
