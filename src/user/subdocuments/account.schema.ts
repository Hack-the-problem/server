import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop()
  snsId: string;

  @Prop({ enum: ['kakao', 'google', 'local', 'temp'] })
  provider: string;

  @Prop()
  password?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
