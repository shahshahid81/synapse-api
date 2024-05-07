import { Injectable, NestMiddleware } from '@nestjs/common';
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
      response.status(401).json({
        success: false,
        message: 'Unauthorized: Missing authorization header',
      });
      return;
    }

    const token = authorization.split(' ')[1];
    try {
      const user = await this.tokenListService.getUser(token);
      request.user = user;
      next();
    } catch (err) {
      response
        .status(401)
        .json({ success: false, message: err?.message || 'Invalid token' });
      return;
    }
  }
}
