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
import { BufferWindowMemory } from 'langchain/memory';
import { CallbackManager } from 'langchain/callbacks';
import { OpenAI } from 'langchain/llms/openai';
import { z } from 'zod';

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

  public resultParser = StructuredOutputParser.fromZodSchema(
    z.object({
      job: z.string().describe('the best job AI recommend'),
      reasons: z.array(z.string()).describe('top three reasons why AI recommended the job'),
      bestType: z.string().describe(`best RIASEC type. answer exact type name. example: 'R'`),
      types: z
        .array(z.string())
        .describe(`top three RIASEC types. answer exact type's capital letter.`),
      strengths: z.array(z.string()).describe(`three strengths of the client's RIASEC best type`),
      weaknesses: z.array(z.string()).describe(`three weaknesses of the client's RIASEC best type`),
      diary: z.array(z.string()).describe(`
          the recommended career youngman's diary in four sentences.
          each sentence describe different timeline in self-reflective tone.
          diary start in morning and end in afterwork.
          `),
      scenarios: z.array(z.string()).describe(`
          four scenarios of the recommended career youngman with only gerund. 
          Each scenario's timeline is morning, lunch, afternoon, afterwork but the time is not written in the sentence.
          `),
    }),
  );

  createReportPrompt() {
    return new PromptTemplate({
      template: `Make career counseling report in english as best as possible. \n{format_instructions}\n{counsels}`,
      inputVariables: ['counsels'],
      partialVariables: { format_instructions: this.resultParser.getFormatInstructions() },
    });
  }

  createModel() {
    return new OpenAI({
      temperature: 0,
      cache: true,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: process.env.OPEN_API_KEY,
    });
  }
}
