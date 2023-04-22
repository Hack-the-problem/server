import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.schema';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatService } from 'src/chat/chat.service';
import { makeInput } from 'src/utils/makeInput.js';

@Controller('result')
export class ResultController {
  constructor(
    private readonly resultService: ResultService,
    private readonly chatService: ChatService,
    private readonly langchainService: LangchainService,
  ) {}

  @Get(':id')
  async getResult(@Param('id') id: string): Promise<Result> {
    return await this.resultService.findById(id);
  }

  @Post()
  async createResult(@Body() { chatRoomId, input, reportTemplate }): Promise<Result> {
    // const input = makeInput(template, jobName);
    const senario = await this.langchainService.getResponse(chatRoomId, input);
    const newCartoonObject = await this.resultService.createCartoon(senario);
    const report = await this.langchainService.getResponse(
      chatRoomId,
      reportTemplate ?? '지금까지 대화를 토대로 직업 보고서를 작성해줘',
    );
    return await this.resultService.create(chatRoomId, newCartoonObject, report);
  }
}
