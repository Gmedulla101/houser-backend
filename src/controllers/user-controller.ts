import userModel from '../models/User-model';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { Response } from 'express';
import { ModifiedRequest } from '../middleware/auth-middleware';
import { BadRequestError } from '../errors';

export const getUser = asyncHandler(
  async (req: ModifiedRequest, res: Response) => {
    const user = await userModel.find({ _id: req?.user?.userId });

    if (!user) {
      throw new BadRequestError('This user does not exist');
    }

    res.status(StatusCodes.OK).json({ sucess: true, data: user });
  }
);

export const checkUser = asyncHandler(
  async (req: ModifiedRequest, res: Response) => {
    const { username, email } = req.query;

    let queryObject: any = {};

    if (username) {
      queryObject.username = username;
    }

    if (email) {
      queryObject.email = email;
    }

    const user = await userModel.findOne(queryObject);

    if (user) {
      throw new BadRequestError(`${username || email} already exists`);
    }

    res.status(StatusCodes.OK).json({ success: true, data: 'proceed' });
  }
);
