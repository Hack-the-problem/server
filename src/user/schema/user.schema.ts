import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ index: true })
  _id?: Types.ObjectId;

  @Prop()
  snsId: string;

  @Prop()
  provider: string;

  @Prop()
  resultIds: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
