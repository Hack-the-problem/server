import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatModule } from './chat/chat.module';
import { LangchainModule } from './langchain/langchain.module';
import { LoggerMiddleware } from './utils/loggers/request.logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ResultModule } from './result/result.module';
import { CommentModule } from './comment/comment.module';
import { SlackExceptionFilter } from './utils/slack/slack.exception.filter';
import { SlackModule } from './utils/slack/slack.module';
import { SlackService } from './utils/slack/slack.service';
import { CustomLogger } from './utils/loggers/customLogger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ChatRoomModule,
    ChatModule,
    LangchainModule,
    PassportModule,
    AuthModule,
    UserModule,
    ResultModule,
    CommentModule,
    SlackModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SlackService,
    CustomLogger,
    {
      provide: APP_FILTER,
      useClass: SlackExceptionFilter,
    },
  ],
  exports: [SlackService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
