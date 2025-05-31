import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import userModel from '../models/User-model';
import confirmationModel from '../models/User-confirmation';
import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} from '../errors';
import { Response, Request } from 'express';
import transporter from '../utils/nodemailer-transporter';

import generateForgotPasswordEmail from '../utils/emails/fg-pswd-info';
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

  const isPasswordCorrect = await bcrypt.compare(password, user?.password!);

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
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Unauthorised' });
    }

    //RECEIVING THE TOKEN DIRECTLY AFTER VERIFYING USER PRESCENCE IN DATABSE IN THE PASSPORT JS UTILITY

    const token = req.user;

    res.redirect(`http://localhost:5173/google-success/token?token=${token}`);
  }
);

export const googleLogout = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
    });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Logged out',
    });
  });
});

//CONFIRMING EMAIL TO SEND THE RESET CODE
export const confirmEmailSendOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Please fill in all the fields');
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      throw new NotFoundError('The requested user does not exist');
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const newEmailInfo = generateForgotPasswordEmail(
      existingUser.email,
      randomNumber
    );

    //IF THE USER CONFIRMATION ROW ALREADY EXISTS, IT WILL BE UPDATED ACCORDINGLY
    await confirmationModel.findOneAndUpdate(
      {
        userEmail: email,
      },
      { $set: { confirmationCode: randomNumber } },
      { upsert: true }
    );

    transporter.sendMail(newEmailInfo, (error, info) => {
      if (error) {
        throw new BadRequestError(
          `Error sending email: ${JSON.stringify(error)}`
        );
      } else {
        res.status(StatusCodes.OK).json({
          success: true,
          msg: 'Email confirmed, confirmation code sent',
          response: info.response,
          userId: existingUser.id,
        });
      }
    });
  }
);

export const confirmCodeResetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, email, password } = req.body;

    const userConfirmation = await confirmationModel.findOne({
      userEmail: email,
    });

    if (!userConfirmation) {
      throw new BadRequestError(
        'This user has not requested for a password reset'
      );
    }

    //CHECKING THE CONFIRMATION CODE
    if (userConfirmation.confirmationCode !== Number(code)) {
      throw new BadRequestError('The entered code is incorrect. Try again');
    }

    //ENCRYPTING THE PASSWORD
    const hashedSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hashedSalt);

    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Password reset succesful, proceeed to login',
    });
  }
);
