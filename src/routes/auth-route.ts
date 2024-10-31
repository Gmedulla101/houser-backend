import express from 'express';
import {
  register,
  login,
  getUser,
  checkUser,
} from '../controllers/auth-controller';
import { auth } from '../middleware/auth-middleware';

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);
authRouter.get('/getUser', auth, getUser);
authRouter.get('/checkUser', checkUser);

export default authRouter;
