const CustomApiError = require('./custom-error');
import { StatusCodes } from 'http-status-codes';

class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message), (this.statusCode = StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
