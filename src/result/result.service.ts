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

  async create(chatRoomId: string, cartoon: any, report: string): Promise<Result> {
    return (await this.resultModel.create([{ chatRoomId, cartoon, report }]))?.[0];
  }

  async findById(id: string): Promise<Result> {
    return this.resultModel.findById(id).exec();
  }

  makePrompt(userInfo, senario) {
    const defaultPrompt =
      'masterpiece, best quality, extremely detailed CG, beautiful detailed eyes, ultra-detailed, intricate details, 8k wallpaper, elaborate features emma watson ';
    const defaultNegativePrompt =
      'low resolution, blurry, worst quality, low quality, huge breasts, nsfw, bad proportions, big eyes, normal quality, ';
    return {
      prompt: defaultPrompt + `${userInfo.gender}, ` + 'backend developer',
      negativePrompt: defaultNegativePrompt + `not ${userInfo.gender}, ` + 'not working alone',
    };
  }

  async createCartoon(userInfo, senario): Promise<Cartoon> {
    const { prompt, negativePrompt } = this.makePrompt(userInfo, senario);
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
    console.log(response);
    console.log('stable diffusion output:: ', response.data);

    console.log('response', response);

    // const data = { inputs: prompt };
    // const response = await fetch(
    //   'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
    //   {
    //     headers: { Authorization: 'Bearer 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' },
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //   },
    // );

    // const result = await response.blob();
    // console.log(result);
    // const buffer = await result.arrayBuffer();
    // const imageResult = await sharp(buffer).png().toFile('image.png');
    // console.log('imageResult', imageResult);

    return {
      prompt,
      negativePrompt,
      // sdId: '1',
      sdId: response.data.id,
      // imageURLs: ['1'],
      imageURLs: response.data.output,
    };
  }
}
