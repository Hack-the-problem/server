import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.schema';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { UserService } from 'src/user/user.service';

@Controller('result')
export class ResultController {
  constructor(
    private readonly resultService: ResultService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Get(':id')
  async getResult(@Param('id') id: string): Promise<Result> {
    return await this.resultService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createCounselReport(@Body() { chatRoomId }) {
    try {
      const chatIds = await this.chatRoomService.getChatIds(chatRoomId);
      const chats = await this.chatService.findBy({ _id: { $in: chatIds } });
      const counsels = JSON.stringify(
        chats.map(({ question, answer }) => {
          return { question, answer };
        }),
      );
      const parser = this.langchainService.parser;
      const prompt = this.langchainService.createReportPrompt();
      const input = await prompt.format({ counsels });
      const model = this.langchainService.createModel();
      const response = await model.call(input);
      console.log('response', response);
      const report = await parser.parse(response);
      const { job, reasons, bestType, strengths, weaknesses, diary, scenarios, types } = report;
      console.log('bestType', bestType);
      console.log('types', types);
      const reportObject = this.resultService.createReport({
        job,
        reasons,
        bestType,
        strengths,
        weaknesses,
        diary,
        types,
      });
      const cartoonObjects = await Promise.all([
        ...scenarios.split(',').map((scenario) => this.resultService.createCartoon(job, scenario)),
      ]);
      return await this.resultService.create(chatRoomId, reportObject, cartoonObjects);
    } catch (err) {
      console.log(err);
    }
  }
}
