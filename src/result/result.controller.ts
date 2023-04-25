import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.schema';
import { LangchainService } from 'src/langchain/langchain.service';
import { ChatService } from 'src/chat/chat.service';
import { makeInput } from 'src/utils/makeInput.js';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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
  async createResult(
    @Request() req,
    @Body() { userId, chatRoomId, input, reportTemplate },
  ): Promise<Result> {
    // const input = makeInput(template, jobName);
    const user = await this.userService.findBy({ _id: userId });
    const senario = await this.langchainService.getResponse(chatRoomId, input);
    const senarioChatObject = await this.chatService.create(input, senario);

    const cartoonObject = await this.resultService.createCartoon(user, senario);

    const reportInput = reportTemplate ?? '지금까지 대화를 토대로 직업 보고서를 작성해줘';
    const report = await this.langchainService.getResponse(chatRoomId, reportInput);
    const reportChatObject = await this.chatService.create(reportInput, report);

    await this.chatRoomService.addChat(chatRoomId, [senarioChatObject._id, reportChatObject._id]);
    const newResult = await this.resultService.create(chatRoomId, cartoonObject, report);

    await this.userService.addResultId(req.user._id, newResult._id);

    return newResult;
  }
}
