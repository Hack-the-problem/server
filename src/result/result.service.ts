import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './result.schema';
import axios from 'axios';
import sharp from 'sharp';

import { Cartoon } from './subDocuments/cartoon.schema';

@Injectable()
export class ResultService {
  constructor(@InjectModel(Result.name) private resultModel: Model<ResultDocument>) {}

  async create(chatRoomId: string, report, cartoon: any): Promise<Result> {
    return (await this.resultModel.create([{ chatRoomId, report, cartoon }]))?.[0];
  }

  async findById(id: string): Promise<Result> {
    return this.resultModel.findById(id).exec();
  }

  createReport({ job, reasons, bestType, strengths, weaknesses, diary, types }) {
    return {
      job,
      reasons: reasons.split(','),
      bestType,
      strengths: strengths.split(','),
      weaknesses: weaknesses.split(','),
      diary,
      types,
    };
  }

  makePrompt(senario) {
    const defaultPrompt =
      'masterpiece, best quality, extremely detailed CG, beautiful detailed eyes, ultra-detailed, intricate details, 8k wallpaper, elaborate features emma watson ';
    const defaultNegativePrompt =
      'low resolution, blurry, worst quality, low quality, huge breasts, nsfw, bad proportions, big eyes, normal quality, ';
    return {
      prompt: defaultPrompt + 'backend developer',
      negativePrompt: defaultNegativePrompt + 'not working alone',
    };
  }

  async createCartoon(prompt): Promise<Cartoon> {
    const url = 'https://stablediffusionapi.com/api/v3/text2img';
    const data = {
      key: process.env.STABLE_DIFFUSION_KEY,
      prompt,
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

    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data.status === 'error') {
      throw new InternalServerErrorException(response.data.message);
    }

    console.log('stable diffusion output:: ', response.data);

    return {
      prompt,
      negativePrompt: 'default',
      sdId: response.data.id,
      imageURLs: response.data.output,
    };
  }
}
