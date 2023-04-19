import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
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
      res.redirect(`${process.env.CLIENT_URL}/login`);
      return;
    }
    const token = await this.authService.createToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/callback?token=${token}`);
  }
}
