import express from 'express';
import { register, login, getUser } from '../controllers/auth-controller';
import { auth } from '../middleware/auth-middleware';

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);
authRouter.get('/getUser', auth, getUser);

export default authRouter;
