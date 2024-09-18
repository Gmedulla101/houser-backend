import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';

const auth = async (req, res, next) => {
  const authHeader = req.body;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      username: payload.username,
      email: payload.email,
      id: payload.userId,
    };
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
