import { StatusCodes } from 'http-status-codes';
const CustomApiError = require('./custom-error');

export default class UnauthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
