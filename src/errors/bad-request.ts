const CustomApiError = require('./custom-error');
import { StatusCodes } from 'http-status-codes';

export default class BadRequestError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
