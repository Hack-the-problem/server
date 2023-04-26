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
    // const initPrompt = `
    // 아래 응답 예시와 같은 형태로 질문 목록을 작성해줘
    // 모든 질문은 RIASEC 진로 상담 모형에 기반하여 10대 청소년을 대상으로 한 상담 질문을 만드는 게 목표야.

    // 포맷: {첫번째 질문}, {두번째 질문}, {세번째 질문}, {네번째 질문}, {다섯번째 질문}

    // 요구사항:
    // 첫번째 질문: 친한 친구에게 진로 상담을 시작하는 인사와 함께 친구의 흥미를 물어보는 질문
    // 두번째 질문: 관심 분야에 대한 질문
    // 세번째 질문: 자기 성찰과 자기 평가, 자기 인식에 대한 질문
    // 네번째 질문: 추구하는 가치에 대한 질문
    // 다섯번째 질문: 회피하는 행동에 대한 질문

    // 인삿말 필요 없이 포맷처럼 ','로 질문을 구분한 문자열만 생성해
    // `;
    // const response = await this.langchainService.getResponse(newChatRoom._id, initPrompt);
    // console.log('chatroom Init:: ', response);

    return newChatRoom;
  }

  @Get('/instance')
  getActiveChainInstance() {
    return this.langchainService.getChains();
  }

  // @Get('/counsel/:counselId')
}
