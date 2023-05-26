import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(user: User): Promise<string> {
    const payload = { sub: user._id, status: user.status };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async decodeToken(token) {
    return this.jwtService.decode(token);
  }
}
