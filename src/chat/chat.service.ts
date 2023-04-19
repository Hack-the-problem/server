import { Injectable } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';

@Injectable()
export class ChatService {
  constructor(private readonly langchainService: LangchainService) {}

  async getChatResponse(id, input): Promise<string> {
    const chain = this.langchainService.getChain(id);
    const response = await chain.call({
      input,
    });

    console.log(response);

    return response.response;
  }
}
