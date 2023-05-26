import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { Result, ResultDocument } from './result.schema';
import { Cartoon } from './subDocuments/cartoon.schema';

@Injectable()
export class ResultService {
  constructor(@InjectModel(Result.name) private resultModel: Model<ResultDocument>) {}

  async create(chatRoomId: string, report, cartoons: any): Promise<Result> {
    return (await this.resultModel.create([{ chatRoomId, report, cartoons }]))?.[0];
  }

  async findById(id: string): Promise<Result> {
    return this.resultModel.findById(id).exec();
  }

  createReport({ job, reasons, bestType, strengths, weaknesses, diary, types }) {
    return {
      job,
      reasons,
      bestType,
      strengths,
      weaknesses,
      diary,
      types,
    };
  }

  async createCartoon(job, senario): Promise<Cartoon> {
    const url = 'https://stablediffusionapi.com/api/v3/text2img';
    const data = {
      key: process.env.STABLE_DIFFUSION_KEY,
      prompt: `${job} ${senario}, masterpiece, best quality, ultra realistic details, sharp focus, style of webtoon`,
      negative_prompt:
        'low resolution, blurry, worst quality, low quality, huge breasts, nsfw, bad proportions, big eyes, normal quality',
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

    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === 'error') {
        throw new InternalServerErrorException(response.data.message);
      }

      console.log('stable diffusion output:: ', response.data);

      return {
        sdId: response.data.id,
        imageURLs: response.data.output,
      };
    } catch (err) {
      console.log(err);
      return {
        sdId: null,
        imageURLs: ['api limit exceeded'],
      };
    }
  }
}
