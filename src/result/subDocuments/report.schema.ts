import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop()
  job: string;

  @Prop()
  reasons: string[];

  @Prop()
  bestType: string;

  @Prop()
  types: string[];

  @Prop()
  strengths: string[];

  @Prop()
  weaknesses: string[];

  @Prop()
  diary: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
