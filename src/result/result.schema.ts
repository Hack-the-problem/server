import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ types: Types.ObjectId, ref: 'chatRoom' })
  chatRoomId: Types.ObjectId;

  @Prop()
  image: string;

  @Prop()
  report: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
