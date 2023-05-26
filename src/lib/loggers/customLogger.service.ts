import { Injectable } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';
import { SlackService } from '../slack/slack.service';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor(private slackService: SlackService) {
    super();
  }

  async error(message: any, ...optionalParams: any[]) {
    await this.slackService.sendLogMessage(`[Error]: ${message}`);
    console.error(message, ...optionalParams);
  }
}
