import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import passport from 'passport-google-oauth2';
import userModel from '../models/User-model';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { Response, Request } from 'express';

dotenv.config();

type UserDetails = {
  username: string;
  fullName?: string;
  email: string;
  password: string;
};

//ENSURING PRESENCE OF JWT SECRET
const authSecret = process.env.JWT_SECRET;

if (!authSecret) {
  throw new Error('Problems with the env file, type: jsonwebtoken');
}

//REGISTER FUNCTIONALITY
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username, fullName }: UserDetails = req.body;

  if (!email || !password || !username) {
    throw new BadRequestError('Please enter complete sign up details');
  }

  //CHECKING TO SEE IF THE USERNAME AND EMAIL ALREADY EXIST IN THE DATABASE
  const takenUsername = await userModel.findOne({ username });
  const prevUser = await userModel.findOne({ email });
  if (takenUsername) {
    throw new BadRequestError('Username has been taken!');
  }
  if (prevUser) {
    throw new BadRequestError('User already exists!');
  }

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await userModel.create({
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
    fullName,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
    },
    authSecret,
    { expiresIn: '30d' }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    username: newUser.username,
    email: newUser.email,
    id: newUser._id,
    token,
  });
});

//LOGIN FUNCTIONALITY
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please enter complete login details');
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User doesn't exist!");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password is not correct');
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    authSecret,
    { expiresIn: '30d' }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    username: user.username,
    email: user.email,
    id: user._id,
    token,
  });
});

//GOOGLE AUTH FUNCTIONALITY

export const googleFailure = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.user);
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: 'Auth with google failed',
    });
  }
);

export const googleSuccess = asyncHandler(
  async (req: Request, res: Response) => {
    res.redirect(
      `http://localhost:5173/google-sucess?user=${JSON.stringify(req.user)}`
    );
  }
);
