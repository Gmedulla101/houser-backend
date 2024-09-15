import { StatusCodes } from 'http-status-codes';
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  const authHeader = req.body;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  };

  const token = authHeader.split(' ')[1];

  try {
    
  } catch (error) {
    
  }
};
