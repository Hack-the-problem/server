import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id?: Types.ObjectId;

  @Prop()
  snsId: string;

  @Prop()
  provider: string;

  @Prop()
  password?: string;

  @Prop({ default: false })
  isAdmin?: boolean;

  @Prop()
  name?: string;

  @Prop()
  phone?: string;

  @Prop()
  birthday?: string;

  @Prop()
  mbti?: string; // should be enum

  @Prop()
  gender?: string; // should be enum

  @Prop()
  school?: string;

  @Prop()
  grade?: number;

  @Prop()
  resultIds?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
