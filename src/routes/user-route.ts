import { Router } from 'express';
import { checkUser, getUser } from '../controllers/user-controller';
import { auth } from '../middleware/auth-middleware';

const userRouter = Router();

userRouter.get('/get-user/:userId', auth, getUser);
userRouter.get('/checkUser', checkUser);

export default userRouter;
