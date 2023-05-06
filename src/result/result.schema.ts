import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Cartoon, CartoonSchema } from './subDocuments/cartoon.schema';
import { Report, ReportSchema } from './subDocuments/report.schema';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ types: Types.ObjectId, ref: 'chatRoom' })
  chatRoomId: Types.ObjectId;

  @Prop({ types: ReportSchema })
  report: Report;

  @Prop({ types: CartoonSchema })
  cartoons: Cartoon[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);
