import { Injectable } from '@nestjs/common';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';
import { BufferWindowMemory } from 'langchain/memory';
import { CallbackManager } from 'langchain/callbacks';

@Injectable()
export class LangchainService {
  chainTable = {};
  private model = new ChatOpenAI({
    callbackManager: CallbackManager.fromHandlers({
      async handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    }),
    cache: true,
    openAIApiKey: process.env.OPEN_API_KEY,
    temperature: 0.9,
  });

  private chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.',
    ),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ]);

  createChain() {
    return new ConversationChain({
      memory: new BufferWindowMemory({
        returnMessages: true,
        memoryKey: 'history',
      }),
      prompt: this.chatPrompt,
      llm: this.model,
    });
  }

  getChain(id) {
    if (!this.chainTable[id]) {
      this.chainTable[id] = this.createChain();
    }
    return this.chainTable[id];
  }

  getChains() {
    return Object.keys(this.chainTable);
  }

  deleteChain(id) {
    delete this.chainTable[id];
    console.log('삭제되었습니다.', `result: ${this.chainTable[id]}`);
  }

  async initChatbot(chatRoomId, input) {
    const chain = this.getChain(chatRoomId);
    const { response } = await chain.call({
      input,
    });
    return response;
  }

  async getResponse(chatRoomId, input): Promise<string> {
    if (!chatRoomId) return 'need chatRoomId';
    if (input === '종료') {
      this.deleteChain(chatRoomId);
      return 'session finished';
    }
    const chain = this.getChain(chatRoomId);
    const { response } = await chain.call({
      input,
    });
    return response;
  }
}
