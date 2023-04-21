import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScoreDocument = HydratedDocument<Score>;

@Schema({ autoCreate: false, autoIndex: false })
export class Score {
  @Prop()
  R: number;

  @Prop()
  I: number;

  @Prop()
  A: number;

  @Prop()
  S: number;

  @Prop()
  E: number;

  @Prop()
  C: number;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
