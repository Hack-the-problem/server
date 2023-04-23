import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findBy({ 'accounts.email': email });
    if (!user) throw new NotFoundException('invalid email');

    const localAccount = user.accounts.find(({ provider }) => provider === 'local');
    if (localAccount.password !== password) throw new BadRequestException('ivnalid password');

    return user;
  }
}
