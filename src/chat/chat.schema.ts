import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Score, ScoreSchema } from './subdocument/score.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  round: number;

  @Prop()
  question: string;

  @Prop()
  answer: string;

  @Prop({ type: ScoreSchema })
  score?: Score;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
