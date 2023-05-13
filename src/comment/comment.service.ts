import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './comment.schema';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async create(createUserDto) {
    return (await this.commentModel.create([createUserDto]))[0];
  }

  async findAllByFilter(filter) {
    return await this.commentModel.find(filter).lean();
  }
}
