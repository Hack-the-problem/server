import { Controller, Get, Post } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { LangchainService } from 'src/langchain/langchain.service';

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly langchainService: LangchainService,
  ) {}

  @Post()
  async create() {
    const newChatRoom = await this.chatRoomService.create();
    const initPrompt = `
    너에게 상담사 역할을 맡길거야. 너에 대한 인사랑 소개는 생략해줘. 답변은 RIASEC유형을 파악하는데 쓰일거야. 대화체는 소셜미디어를 활용해서 중학교 3학년의 말투를 참고해서 해주세요. 반말로 질문해주세요.  교육에 좋지 않은 단어는 생략해줘. 결과는 각 문항당 한줄씩  말해줘. 인사는 생략해줘.

    1.적성흥미 
    2.자기평가 
    3.선호활동
    4.회피활동
    5.가치
    `;
    await this.langchainService.getResponse(newChatRoom._id, initPrompt);

    return newChatRoom;
  }

  @Get('/instance')
  getActiveChainInstance() {
    return this.langchainService.getChains();
  }
}
