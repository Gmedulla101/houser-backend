import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

const userModel = require('../models/User-model');
const { BadRequestError } = require('../errors');

type UserDetails = {
  username: string;
  email: string;
  password?: string;
};

const register = async (req, res) => {
  const { email, password, username }: UserDetails = req.body;
  if (!email || !password || !username) {
    throw new BadRequestError('Please enter complete sign up details');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await userModel.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    res
      .status(StatusCodes.OK)
      .json({ success: true, username: user.username, token });
  } catch (error) {
    throw new BadRequestError('Authentication discontinued please try again');
  }
};

const login = async (req, res) => {
  res.send('User has loged in');
};

module.exports = {
  register,
  login,
};
