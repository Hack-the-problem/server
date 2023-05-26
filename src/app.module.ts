import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LangchainModule } from './lib/langchain/langchain.module';
import { LoggerMiddleware } from './lib/loggers/request.logger.middleware';
import { SlackExceptionFilter } from './lib/slack/slack.exception.filter';
import { SlackModule } from './lib/slack/slack.module';
import { SlackService } from './lib/slack/slack.service';
import { CustomLogger } from './lib/loggers/customLogger.service';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ApiModule,
    LangchainModule,
    SlackModule,
  ],
  providers: [
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
