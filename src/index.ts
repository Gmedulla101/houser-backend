//IMPORTING NEEDED DEPENDENCIES AND MIDDLEWARE
import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './utils/passport-google-auth';

import connectDB from './db/connectDB';
import notFound from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

//IMPORTING ROUTES
import userRouter from './routes/user-route';
import propertiesRouter from './routes/properties-route';
import authRouter from './routes/auth-route';
import paymentsRouter from './routes/payment-route';

dotenv.config();
const app = express();
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('Session secret not set');
}
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//NEEDED DEFAULT MIDDLEWARE
app.use(express.json());
app.use(urlencoded({ extended: false }));

const allowedOrgins = [
  'http://localhost:5173',
  'https://houser-navy.vercel.app',
];
app.use(
  cors({
    credentials: true,
    origin: allowedOrgins,
  })
);

//SETTING UP ROUTERs
app.use('/api/v1/user', userRouter);
app.use('/api/v1/properties', propertiesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/payments', paymentsRouter);

//ERROR MIDDLEWARE
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('Problems with the env file, type: MongoURI');
    }
    await connectDB(mongoURI);
    console.log('Database connected');
  } catch (error) {
    console.error(error);
  }
  app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
  });
};

start();
