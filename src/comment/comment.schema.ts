import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  resultId: Types.ObjectId;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
