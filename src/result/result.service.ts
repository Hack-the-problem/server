import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Result, ResultDocument } from './result.schema';
import axios from 'axios';
import { Cartoon } from './subDocuments/cartoon.schema';

@Injectable()
export class ResultService {
  constructor(@InjectModel(Result.name) private resultModel: Model<ResultDocument>) {}

  async create(chatRoomId: string, cartoon: any, report: string): Promise<Result> {
    return (await this.resultModel.create([{ chatRoomId, cartoon, report }]))?.[0];
  }

  async findById(id: string): Promise<Result> {
    return this.resultModel.findById(id).exec();
  }

  makePrompt(senario) {
    return { prompt: 'backend developer', negativePrompt: 'not working alone' };
  }

  async createCartoon(senario): Promise<Cartoon> {
    const { prompt, negativePrompt } = this.makePrompt(senario);
    const url = 'https://stablediffusionapi.com/api/v3/text2img';
    const data = {
      key: process.env.STABLE_DIFFUSION_KEY,
      prompt,
      negative_prompt: negativePrompt,
      width: '512',
      safety_checker: 'yes',
      guidance: '7.5',
      height: '512',
      samples: '1',
      steps: 20,
      seed: null,
      webhook: null,
      track_id: null,
    };
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data.status === 'error') {
      throw new InternalServerErrorException(response.data.message);
    }

    return {
      prompt,
      negativePrompt,
      sdId: response.data.id,
      imageURLs: response.data.output,
    };
  }
}
