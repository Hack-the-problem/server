import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Account, AccountSchema } from './subdocuments/account.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop({ type: [AccountSchema] })
  accounts: Account[];

  @Prop({ enum: ['pending', 'done'], default: 'pending' })
  status: string;

  @Prop({ default: false })
  isAdmin?: boolean;

  @Prop()
  name?: string;

  @Prop()
  phone?: string;

  @Prop()
  birthday?: string;

  @Prop()
  mbti?: string; // should be enum

  @Prop()
  gender?: string; // should be enum

  @Prop()
  school?: string;

  @Prop()
  grade?: number;

  @Prop({ type: [SchemaTypes.ObjectId] })
  resultIds?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
