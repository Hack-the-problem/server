import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-kakao';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/kakao/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const snsId = profile.id;
    let user = await this.userService.findBy({ 'accounts.snsId': snsId });

    console.log('exist user', user);
    // 회원가입
    if (!user) {
      user = await this.userService.create({
        status: 'pending',
        accounts: [{ snsId, provider: 'kakao' }],
      });
      console.log('new user', user);
    }

    return user;
  }
}
