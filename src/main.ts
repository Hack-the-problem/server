import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './utils/loggers/customLogger.service';
import { SlackService } from './utils/slack/slack.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const slackService = appContext.get(SlackService);
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new CustomLogger(slackService),
  });
  await app.listen(3000);
}
bootstrap();
