import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findBy(filter): Promise<User> {
    return this.userModel.findOne(filter).lean().exec();
  }

  async create(user: User): Promise<User> {
    return this.userModel.create(user);
  }
}