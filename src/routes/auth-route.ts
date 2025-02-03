import express from 'express';
import {
  register,
  login,
  signInWithGoogle,
} from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);
authRouter.post('/google-auth', signInWithGoogle);

export default authRouter;
