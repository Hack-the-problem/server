import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    const jwtService = new JwtService({});

    try {
      const decodedToken = jwtService.verifyAsync(token, {
        publicKey: process.env.JWT_PUBLIC_KEY,
      });
      console.log(decodedToken);
      return decodedToken;
    } catch (err) {
      return null;
    }
  },
);
