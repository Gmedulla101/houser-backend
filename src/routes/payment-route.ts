import { Router } from 'express';
//IMOPORTING CONTROLLERS
import {
  initializePayment,
  verifyPayment,
} from '../controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter.post('/initialize-payment', initializePayment);
paymentsRouter.get('/verify-payment', verifyPayment);

export default paymentsRouter;
