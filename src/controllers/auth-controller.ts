const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { StatusCodes } from 'http-status-codes';

const userModel = require('../models/User-model');
const { BadRequestError, UnauthenticatedError } = require('../errors');

type UserDetails = {
  username: string;
  email: string;
  password?: string;
};

const register = async (req, res) => {
  const { email, password, username }: UserDetails = req.body;

  try {
    if (!email || !password || !username) {
      throw new BadRequestError('Please enter complete sign up details');
    }

    const takenUsername = await userModel.findOne({ username });
    if (takenUsername) {
      throw new BadRequestError('Username has been taken');
    }

    const prevUser = await userModel.findOne({ email });
    if (prevUser) {
      throw new BadRequestError('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET
    );

    res
      .status(StatusCodes.OK)
      .json({ success: true, username: newUser.username, token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("User doesn't exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Password is not correct');
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    res
      .status(StatusCodes.OK)
      .json({ success: true, username: user.username, token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
