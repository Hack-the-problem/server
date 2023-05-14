import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Res,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;
    const localAccountObject = {
      email,
      password,
      provider: 'local',
    };
    return await this.userService.create({
      accounts: [localAccountObject],
      status: 'done',
      ...rest,
    });
  }

  @Post('/temp')
  async createTempUser(@Body() { nickname, password }) {
    const tempAccountObject = {
      nickname,
      password,
      provider: 'temp',
    };
    return await this.userService.create({ accounts: [tempAccountObject] });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getMyInfo(@Request() req) {
    return await this.userService.findBy({ _id: req.user._id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile')
  async updateMyInfo(@Request() req, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const updatedUser = await this.userService.update(req.user._id, updateUserDto);
    const accessToken = await this.authService.createToken(updatedUser);
    return res.send({ token: accessToken });
  }
}
