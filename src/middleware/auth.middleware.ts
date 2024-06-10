import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExtendedRequest } from 'src/common/extended-request.interface';
import { TokenlistService } from 'src/tokenlist/tokenlist.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenListService: TokenlistService) {}

  async use(
    request: ExtendedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const authorization =
      request.headers.authorization || request.headers.Authorization;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authorization.split(' ')[1];
    try {
      const user = await this.tokenListService.getUser(token);
      request.user = user;
      request.token = token;
      next();
    } catch (err) {
      throw new UnauthorizedException(err?.message || 'Invalid token');
    }
  }
}
