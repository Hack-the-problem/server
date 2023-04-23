import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() { userId, resultId }) {
    return this.commentService.create(userId, resultId);
  }
}
