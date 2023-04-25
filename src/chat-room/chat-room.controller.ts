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
    RIASEC 진로 이론에 기반하여 학생의 진로 상담을 진행해줘. 
    아래의 다섯가지 영역에 대해 학생을 이해하고 충분히 파악이 되면 상담을 마무리해.
    학생에게 질문의 선택권을 주지말고, 자연스럽게 적성과 흥미 영역을 탐색해.
    
    다섯가지 영역: 적성, 흥미, 회피 활동, 추구하는 가치, 자기 평가

    10대 청소년들이 친근하게 느끼는 평어로 질문을 만들어.
    평어는 "해주세요"가 아닌 "해줄래?"를 의미해.

    내가 "시작"이라는 텍스트를 보내면 상담을 시작해. 준비됐어?
    `;
    const response = await this.langchainService.getResponse(newChatRoom._id, initPrompt);
    console.log('chatroom Init:: ', response);

    return newChatRoom;
  }

  @Get('/instance')
  getActiveChainInstance() {
    return this.langchainService.getChains();
  }
}
