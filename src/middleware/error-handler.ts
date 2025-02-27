import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

interface ModifiedErr extends Error {
  statusCode: number;
  errors: any;
  value: any;
  code: any;
  keyValue: any;
}

const errorHandlerMiddleware = (
  err: ModifiedErr,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  //VALIDATION ERROR
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((items: any) => items.message)
      .join(', also, ');
    customError.statusCode = 400;
  }

  //CAST ERROR
  if (err.name === 'CastError') {
    customError.msg = `No item found with an id of ${err.value}`;
    customError.statusCode = 404;
  }

  // DUPLICATE ERROR
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field: Email already exists`;
    customError.statusCode = 400;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  res.status(customError.statusCode).json({ msg: customError.msg });
  return;
};

export default errorHandlerMiddleware;
