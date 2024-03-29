import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findBy(filter): Promise<User> {
    return this.userModel.findOne(filter).lean().exec();
  }

  async create(createUserDto): Promise<User> {
    return (await this.userModel.create([createUserDto]))[0];
  }

  async update(_id, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id }, { ...updateUserDto }, { new: true });
  }

  async addResultId(_id, resultId): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      _id,
      { $addToSet: { resultIds: resultId } },
      { new: true },
    );
  }
}
