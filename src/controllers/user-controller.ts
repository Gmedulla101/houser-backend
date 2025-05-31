import userModel from '../models/User-model';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { ModifiedRequest } from '../middleware/auth-middleware';
import { BadRequestError, UnauthenticatedError } from '../errors';

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await userModel.find({ _id: userId }).select('-password');

  if (!user) {
    throw new BadRequestError('This user does not exist');
  }

  res.status(StatusCodes.OK).json({ sucess: true, data: user });
});

export const checkUser = asyncHandler(async (req: Request, res: Response) => {
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
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { username, email, phoneNumber, fullName } = req.body.editData;

  type UpdateObject = {
    username?: string;
    email?: string;
    phoneNumber?: number;
    fullName?: string;
  };

  const updateObject: UpdateObject = {};

  if (username) {
    updateObject.username = username;
  }

  if (email) {
    updateObject.email = email;
  }

  if (phoneNumber) {
    updateObject.phoneNumber = phoneNumber;
  }

  if (fullName) {
    updateObject.fullName = fullName;
  }

  await userModel.findOneAndUpdate({ _id: userId }, updateObject);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'User data updated successfully',
  });
});

export const getUserProfile = asyncHandler(
  async (req: ModifiedRequest, res: Response) => {
    if (!req.user) {
      throw new UnauthenticatedError('Error: No user logged in to access JWT');
    }

    const { userId } = req.user;

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      throw new BadRequestError(
        'The requested user does not exist, please create an account'
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  }
);
