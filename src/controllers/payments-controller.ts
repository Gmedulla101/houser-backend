import asycnHandler from 'express-async-handler';
import axios from 'axios';
import { Response } from 'express';
import { ModifiedRequest } from '../middleware/auth-middleware';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../errors';

export const initializePayment = asycnHandler(
  async (req: ModifiedRequest, res: Response) => {
    const { email, amount, propertyId } = req.body;
    const sercret_key = process.env.PAYSTACK_SECRET_KEY;

    if (!sercret_key) {
      throw new BadRequestError('ENV error: Paystack');
    }

    const data = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: (5 / 100) * amount * 100,
        callback_url: `http://localhost:5173/confirm-payment/${propertyId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${sercret_key}`,
        },
      }
    );

    const authorization_url = data.data.data.authorization_url;

    res.status(StatusCodes.OK).json({
      sucess: true,
      msg: 'Transaction initialized',
      authorization_url,
    });
  }
);

export const verifyPayment = asycnHandler(
  async (req: ModifiedRequest, res: Response) => {}
);
