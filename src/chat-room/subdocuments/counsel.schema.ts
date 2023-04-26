import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type CounselDocument = HydratedDocument<Counsel>;

@Schema()
export class Counsel {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.String })
  question: string;

  @Prop({ type: SchemaTypes.String })
  answer?: string;
}

export const CounselSchema = SchemaFactory.createForClass(Counsel);
