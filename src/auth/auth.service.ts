import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(user: User): Promise<string> {
    const payload = { sub: user._id };
    return this.jwtService.signAsync(payload);
  }
}
