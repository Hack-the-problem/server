import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ ref: 'user' })
  userId?: Types.ObjectId;

  @Prop({ ref: 'chat' })
  chatIds: Types.ObjectId[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
