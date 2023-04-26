import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Counsel, CounselSchema } from './subdocuments/counsel.schema';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ ref: 'user' })
  userId?: Types.ObjectId;

  @Prop({ ref: 'chat' })
  chatIds: Types.ObjectId[];

  @Prop({ type: CounselSchema })
  counsels?: Counsel[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
