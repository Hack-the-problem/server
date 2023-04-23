import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';
@Injectable()
export class SlackService {
  private readonly webhook: IncomingWebhook;

  constructor() {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  }

  async sendLogMessage(message: string): Promise<void> {
    await this.webhook.send({
      text: message,
    });
  }
}
