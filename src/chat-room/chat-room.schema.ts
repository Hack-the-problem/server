import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChatDocument } from '../chat/chat.schema';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ ref: 'user' })
  userId?: Types.ObjectId;

  @Prop()
  chats: ChatDocument[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
