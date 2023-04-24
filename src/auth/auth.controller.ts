import { Controller, Get, UseGuards, Request, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(@Request() req, @Res() res: Response) {
    if (!req.user) {
      res.redirect(`${process.env.CLIENT_URL}/kakaoLogin`);
      return res.status(404).send({ accessToken: null });
    }
    const accessToken = await this.authService.createToken(req.user);
    return res.send({ accessToken, status: req.user.status });
  }

  @Post('local')
  @UseGuards(AuthGuard('local'))
  async localAuth(@Request() req, @Res() res: Response) {
    const accessToken = await this.authService.createToken(req.user);
    return res.send({ accessToken });
  }
}
