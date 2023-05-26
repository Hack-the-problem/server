import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { SlackService } from './slack.service';

@Catch()
export class SlackExceptionFilter implements ExceptionFilter {
  constructor(private readonly slackService: SlackService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const errorFrom = `Request ${req.method} ${req.originalUrl}`;

    console.log(exception);

    if (!exception?.response) {
      const errorMessage = `[ERROR] ${exception.message} \n [stack] ${exception.stack}`;
      await this.slackService.sendLogMessage(errorMessage);
      return res.status(500).send({
        errorFrom,
        statusCode: 500,
        message: exception.message,
        stack: exception.stack,
      });
    }
    const { statusCode, message, error } = exception.response;
    const errorMessage = `[ERROR] ${error} \n ${
      typeof message !== 'string' ? [...message].map((text) => `- ${text}`).join('\n') : message
    }`;

    await this.slackService.sendLogMessage(errorMessage);

    return res.status(statusCode).send({ errorFrom, ...exception.response });
  }
}
