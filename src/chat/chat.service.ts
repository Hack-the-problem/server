import { Injectable } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';

@Injectable()
export class ChatService {
  constructor(private readonly langchainService: LangchainService) {}

  async getChatResponse(id, input): Promise<string> {
    console.log(id);
    if (!id) return 'need id';
    if (input === '종료') {
      this.langchainService.deleteChain(id);
      console.log(this.langchainService.getChain(id));
    }
    const chain = this.langchainService.getChain(id);
    const { response } = await chain.call({
      input,
    });

    return response;
  }
}
