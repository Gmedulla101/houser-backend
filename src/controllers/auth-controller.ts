import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import userModel from '../models/User-model';
import { BadRequestError, UnauthenticatedError } from '../errors';

type UserDetails = {
  username: string;
  email: string;
  password?: string;
};

const register = async (req, res, next) => {
  try {
    const { email, password, username }: UserDetails = req.body;

    if (!email || !password || !username) {
      throw new BadRequestError('Please enter complete sign up details');
    }

    //CHECKING TO SEE IF THE USERNAME AND EMAIL ALREADY EXIST IN THE DATABASE
    const takenUsername = await userModel.findOne({ username });
    if (takenUsername) {
      throw new BadRequestError('Username has been taken');
    }

    const prevUser = await userModel.findOne({ email });
    if (prevUser) {
      throw new BadRequestError('User already exists!');
    }

    //HASHING THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      username: newUser.username,
      email: newUser.email,
      token,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
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
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
