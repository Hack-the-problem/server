import { Injectable } from '@nestjs/common';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { BufferWindowMemory, ConversationSummaryMemory } from 'langchain/memory';
import { CallbackManager } from 'langchain/callbacks';
import { OpenAI } from 'langchain/llms/openai';

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
      `The following is a friendly counseling consist of five questions and answers between a human and an AI. The AI has counsel based on John Hollands's career choice model: RIASEC. Finally the AI is waiting human's request for making counsel report`,
    ),
    new MessagesPlaceholder('counseling'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ]);

  createChain() {
    return new ConversationChain({
      memory: new BufferWindowMemory({
        // returnMessages: true,
        memoryKey: 'counseling',
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
    console.log('input:  ', input);
    const chain = this.getChain(chatRoomId);
    const { response } = await chain.call({
      input,
    });
    return response;
  }

  public parser = StructuredOutputParser.fromNamesAndDescriptions({
    job: 'the best job AI recommend',
    reasons: 'top three reasons why AI recommended the job',
    bestType: 'best RIASEC type within [R, I, A, S, E, C]',
    strengths: `three strengths of the client's RIASEC best type`,
    weaknesses: `three weaknesses of the client's RIASEC best type`,
    diary: `the recommended career youngman's diary of for sentences. Each sentence's timeline goes by morning, lunch, afternoon, afterwork.`,
    scenarios: `four scenarios of the recommended career youngman with only gerund. Each scenario's timeline goes by morning, lunch, afternoon, afterwork but the time is not written in the sentence.`,
    types: `top three RIASEC types within [R, I, A, S, E, C]`,
  });

  createReportPrompt() {
    return new PromptTemplate({
      template: `Make career counseling report as best as possible. \n{format_instructions}\n{counsels}`,
      inputVariables: ['counsels'],
      partialVariables: { format_instructions: this.parser.getFormatInstructions() },
    });
  }

  createModel() {
    return new OpenAI({ temperature: 0, cache: true, openAIApiKey: process.env.OPEN_API_KEY });
  }
}
