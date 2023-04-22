import { Injectable } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { Model } from 'mongoose';
import { spawn } from 'child_process';
import { PythonShell } from 'python-shell';

@Injectable()
export class ChatService {
  constructor(
    private readonly langchainService: LangchainService,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  async create(input, response) {
    return (await this.chatModel.create([{ input, response }]))[0];
  }

  async getScore(input) {
    // const result = await spawn('python', ['scripts/score.py', input]);
    // result.stdout.on('data', (data) => {
    //   console.log('after script:: ', data.toString());
    // });
    // result.stderr.on('data', (data) => {
    //   console.log(data.toString());
    // });

    const shellResponse = await PythonShell.run('scripts/score.py', {
      args: [input],
    });
    console.log(shellResponse);
  }

  async getChatResponse(chatRoomId, input): Promise<string> {
    if (!chatRoomId) return 'need chatRoomId';
    if (input === '종료') {
      this.langchainService.deleteChain(chatRoomId);
    }
    const chain = this.langchainService.getChain(chatRoomId);
    const { response } = await chain.call({
      input,
    });
    return response;
  }
}
