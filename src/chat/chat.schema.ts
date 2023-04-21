import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Score, ScoreSchema } from './subdocument/score.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  input: string;

  @Prop()
  response: string;

  @Prop({ type: ScoreSchema })
  score?: Score;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
