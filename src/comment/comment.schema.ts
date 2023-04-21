import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  resultId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  userId: Types.ObjectId;

  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
