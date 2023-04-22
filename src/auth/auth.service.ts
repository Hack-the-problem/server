import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(user: User): Promise<string> {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
}
