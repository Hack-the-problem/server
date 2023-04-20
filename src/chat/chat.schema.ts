import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Score } from './subdocument/testScore.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  input: string;

  @Prop()
  response: string;

  @Prop()
  score: Score;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
