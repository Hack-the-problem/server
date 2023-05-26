import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './lib/loggers/customLogger.service';
import { SlackService } from './lib/slack/slack.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const slackService = appContext.get(SlackService);
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new CustomLogger(slackService),
  });
  await app.listen(process.env.PORT);
}
bootstrap();
