import { Controller, Get, Put, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getMyInfo(@Request() req) {
    if (!req.user) throw new NotFoundException();
    return await this.userService.findBy({ _id: req.user._id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile')
  async updateMyInfo(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    if (!req.user) throw new NotFoundException();
    return await this.userService.update(req.user._id, updateUserDto);
  }
}
