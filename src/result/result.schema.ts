import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ ref: 'chatRoom' })
  chatRoomId: Types.ObjectId;

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

export const ResultSchema = SchemaFactory.createForClass(Result);
