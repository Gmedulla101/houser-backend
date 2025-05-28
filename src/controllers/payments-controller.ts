import asycnHandler from 'express-async-handler';
import axios from 'axios';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../errors';
import propertyModel from '../models/Properties-model';

export const initializePayment = asycnHandler(
  async (req: Request, res: Response) => {
    const { email, amount, propertyId } = req.body;
    const sercret_key = process.env.PAYSTACK_SECRET_KEY;

    if (!sercret_key) {
      throw new BadRequestError('ENV error: Paystack');
    }

    const requiredProperty = await propertyModel.findOne({ _id: propertyId });

    if (!requiredProperty) {
      throw new BadRequestError('The requested property does not exist');
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: (5 / 100) * amount * 100,
        callback_url: `http://localhost:5173/confirm-payment/${requiredProperty.createdBy}`,
      },
      {
        headers: {
          Authorization: `Bearer ${sercret_key}`,
        },
      }
    );

    const authorization_url = response.data.data.authorization_url;

    res.status(StatusCodes.OK).json({
      sucess: true,
      msg: 'Transaction initialized',
      authorization_url,
    });
  }
);

export const verifyPayment = asycnHandler(
  async (req: Request, res: Response) => {
    const { trxref } = req.params;
    const sercret_key = process.env.PAYSTACK_SECRET_KEY;

    if (!sercret_key) {
      throw new BadRequestError('ENV error: Paystack');
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${trxref}`,
      {
        headers: {
          Authorization: `Bearer ${sercret_key}`,
        },
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Transaction verified successfully',
      data: response.data.message,
    });
  }
);
