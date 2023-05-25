import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './chat-room.schema';

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async create(userId): Promise<ChatRoom> {
    return (await this.chatRoomModel.create([{ _id: new Types.ObjectId(), userId }]))[0];
  }

  async findById(id) {
    return await this.chatRoomModel.findById(id);
  }

  async getChatIds(id) {
    return (await this.chatRoomModel.findById(id, { chatIds: 1 }))?.chatIds;
  }

  async addChat(_id, chatId) {
    return await this.chatRoomModel.findOneAndUpdate(
      { _id },
      { $addToSet: { chatIds: chatId } },
      { new: true },
    );
  }

  async updateIsFinished(_id, isFinished) {
    return await this.chatRoomModel.findOneAndUpdate(
      { _id },
      { isFinished },
      { new: true },
      //
    );
  }

  castQuestion(round) {
    function getRandomValue(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    const questionList = {
      1: ['본인이 잘한다고 생각하는 것을 알려줘!', '어떤 걸 할 때 자신감을 느껴?'],
      2: [
        '스스로를 어떻게 생각해? 잘 해나가고 있는 것 같아 아니면 아쉬운 부분이 있어??',
        '자신의 모습이 본인이 원하는 모습이야? 아니라면 그 이유는?',
      ],
      3: [
        '어떤 활동을 좋아하니? 그 활동을 일로 바꾸는 직업도 있으니까 참고해봐',
        '무슨 활동을 할 때 가장 재미있었어? 직업으로 삼고싶었던 활동이었을까?',
      ],
      4: [
        '어떤 일을 싫어해? 인생에서는 그런 일들을 피하며 살아가는 것도 방법이거든!',
        '기피하고싶은 상황이나 일들이 있을까? 예를 들면 갑자기 발표를 한다든지!?',
      ],
      5: [
        '돈, 사회적 기여 등, 네가 중요하게 생각하는 가치는 뭐야?',
        '추구하는 가치에 따라 알맞는 직업도 달라질거야! 어떤 가치가 제일 소중해? 돈? 명예? 우정?',
      ],
    };
    return getRandomValue(questionList[round]);
  }
}
