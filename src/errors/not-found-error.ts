import { StatusCodes } from 'http-status-codes';
const CustomApiError = require('./custom-error');

export default class NotFoundError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
