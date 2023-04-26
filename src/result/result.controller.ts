import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.schema';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatService } from 'src/chat/chat.service';
import { makeInput } from 'src/utils/makeInput.js';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { reportDirection } from './directions/reportDirection';

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
  async createResult(@Body() { chatRoomId, input }): Promise<Result> {
    const consels = `
    다음 { question: 질문, answer: 상담 }들은 RIASEC 진로이론에 기반한 상담 대화 내역이야.
    ${input}
    `;
    const counselInjected = await this.langchainService.getResponse(chatRoomId, consels);
    console.log('counselInjected', counselInjected);

    const report = await this.langchainService.getResponse(chatRoomId, reportDirection);

    console.log(report);
    const [job, reasons, bestType, strengths, weaknesses, diary, senario, types] = report
      .split(`\n`)
      .map((str) => str.slice(3).replace('*', ''));
    const reportObject = this.resultService.createReport({
      job,
      reasons,
      bestType,
      strengths,
      weaknesses,
      diary,
      types,
    });
    const cartoonObject = await this.resultService.createCartoon(senario);

    return await this.resultService.create(chatRoomId, reportObject, cartoonObject);
  }
}
