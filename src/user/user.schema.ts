import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  _id?: Types.ObjectId;

  @Prop()
  snsId: string;

  @Prop()
  sns: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
