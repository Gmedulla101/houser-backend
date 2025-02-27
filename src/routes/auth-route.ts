import express from 'express';
import {
  register,
  login,
  googleSuccess,
  googleFailure,
} from '../controllers/auth-controller';
import passport from 'passport';

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);
authRouter.get(
  '/google-working',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/google-failure',
  }),
  googleSuccess
);

authRouter.get('/google-faiure', googleFailure);

export default authRouter;
