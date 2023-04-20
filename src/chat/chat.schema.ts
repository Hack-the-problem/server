import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  input: string;

  @Prop()
  response: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
