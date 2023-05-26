import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type CartoonDocument = HydratedDocument<Cartoon>;

@Schema()
export class Cartoon {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop()
  sdId: string;

  @Prop()
  imageURLs: string[];
}

export const CartoonSchema = SchemaFactory.createForClass(Cartoon);
