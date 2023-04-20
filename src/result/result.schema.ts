import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChatDocument } from '../chat/chat.schema';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ ref: 'user' })
  userId?: Types.ObjectId;

  @Prop()
  chats: ChatDocument[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);
