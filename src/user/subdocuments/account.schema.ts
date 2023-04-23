import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import validator from 'validator';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop({ default: undefined })
  snsId?: string;

  @Prop({ enum: ['kakao', 'google', 'local'] })
  provider: string;

  @Prop({
    default: undefined,
    validate: {
      validator: (value: string) => {
        return validator.isEmail(value);
      },
      message: 'not a valid email',
    },
  })
  email?: string;

  @Prop({ default: undefined })
  nickname?: string;

  @Prop({ default: undefined })
  password?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
