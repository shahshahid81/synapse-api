import { Request } from 'express';
import { User } from 'src/users/user.entity';

export interface ExtendedRequest extends Request {
  user: User;
  token: string;
}
