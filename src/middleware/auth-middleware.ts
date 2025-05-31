import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';
import { Request, Response, NextFunction } from 'express';

export interface ModifiedRequest extends Request {
  user?: {
    username?: string;
    email?: string;
    userId?: string;
    userDetails?: any;
    token?: string;
  };
}

const auth = (req: ModifiedRequest, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const authSecret = process.env.JWT_SECRET;
    if (!authSecret) {
      throw new Error('Problems in the env file, type: jsonwebtoken');
    }
    const payload: any = jwt.verify(token, authSecret);

    req.user = {
      username: payload.username,
      email: payload.email,
      userId: payload.userId,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export { auth };
