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
  async createResult(@Body() { chatRoomId, input }): Promise<Result> {
    const consels = `
    다음 { question: 질문, answer: 상담 }들은 RIASEC 진로이론에 기반한 상담 대화 내역이야.
    ${input}
    `;
    const counselInjected = await this.langchainService.getResponse(chatRoomId, consels);
    console.log('counselInjected', counselInjected);
    const reportDirection = `
    RIASEC 기반해서 상담 결과를 제시해줘. 각 답변사이에 *를 붙여서 구분해줘.  한줄로 말해줘. 동시에 유형을 선택할 수는 없어. 
    결과 주제어는 필요없어.  예시문의 형태와 똑같이 대답해.  한줄로 답해. 내 질문은 따라 말하지마.
    
    1. 위의 사용자의 답변을 토대로 추천 직업을 추출해줘. 한글로 써줘.
    
    1번의 예시를 줄게.
    [예술가]
    
    2. 이 직업을 추천한 근거를 3개의 키워드로 표현해서 전해줘. 한글로 써줘.
    
    2번의 예시를 줄게
    [창의성, 예술적 감각, 자유로움]
    
    3. 나의 유형을 선택해줘. 가장 유형 적합도가 높은 하나만 선택해.
    
    3번의 예시를 줄게. [I,탐구형]
    
    
    4. 나의 유형의 강점을 3개 뽑아줘. 한글로 써줘.
    
    5번의 예시를 줄게. 
    [분석적 사고, 상세주의, 논리적 사고]
    
    5. 나의 유형별 약점을 3개 뽑아줘.한글로 써줘.
    
    5번의 예시를 줄게. 
    [인간관계, 소통, 공감 능력]
    
    6. 이 직업의 20대의 하루일기를 4줄로 아침, 점심, 저녁, 퇴근 후로 작성해줘.  인스타그램의 20대의 한국인 문체로 작성해줘.
    
    6번의 예시를 줄게.
    [아침] 기기 수리 및 유지보수 / [점심] 팀원과 회식 / [저녁] 새로운 제품 기획 / [퇴근 후] 기기 관련 도서 읽기
    
    7. 위 직업의 시나리오를 영어 동사구로 적어줘. 그걸 번호로 정리해줘. 그리고 주인공만 말할 수 있어.
    
    7번의 예시를 줄게.
    1. Assessing a patient's condition 2. Administering medication 3. Comforting and reassuring patients. 4. Analyzing data and samples
    
    8. 적합했던 유형 3순위까지 총 3개를 제시해줘.
    
    8번의 예시를 줄게. 
    1._[I,탐구형], 2_[S,사회형], 3_[A,예술형]
    `;

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
