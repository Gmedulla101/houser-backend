import { Router } from 'express';
import { checkUser, getUser, updateUser } from '../controllers/user-controller';
import { auth } from '../middleware/auth-middleware';

const userRouter = Router();

userRouter.get('/get-user/:userId', auth, getUser);
userRouter.get('/checkUser', checkUser);
userRouter.patch('/updateUser/:userId', auth, updateUser);

export default userRouter;
