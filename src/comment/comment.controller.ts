import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createUserDto) {
    return this.commentService.create(createUserDto);
  }

  @Get()
  getCommentByResultId(@Query('resultId') resultId) {
    return this.commentService.findAllByFilter({ resultId });
  }
}
