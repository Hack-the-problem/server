import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    console.log(context.args[0].rawHeaders);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    console.log(err);
    console.log(user);
    console.log(info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (info) {
      throw new Error(info);
    }
    return user;
  }
}
