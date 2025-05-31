import { Router } from 'express';
import {
  checkUser,
  getUser,
  updateUser,
  getUserProfile,
} from '../controllers/user-controller';
import { auth } from '../middleware/auth-middleware';

const userRouter = Router();

userRouter.get('/getUser/:userId', auth, getUser);
userRouter.get('/getUserProfile', auth, getUserProfile);
userRouter.get('/checkUser', checkUser);
userRouter.patch('/updateUser/:userId', auth, updateUser);

export default userRouter;
