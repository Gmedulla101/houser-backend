import express from 'express';
import {
  register,
  login,
  googleSuccess,
  googleFailure,
  googleLogout,
  confirmCodeResetPassword,
  confirmEmailSendOTP,
} from '../controllers/auth-controller';
import passport from 'passport';

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);

//ALL GOOGLE STUFF
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

authRouter.get('/logout', googleLogout);

//FORGOT PASSWORD ROUTE
authRouter.post('/confirm-email', confirmEmailSendOTP);
authRouter.post('/reset-password', confirmCodeResetPassword);

export default authRouter;
