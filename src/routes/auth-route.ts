import express from 'express';
import { register, login, getUser } from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);
authRouter.get('/getUser', getUser);

export default authRouter;
