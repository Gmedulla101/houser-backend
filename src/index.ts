//IMPORTING NEEDED DEPENDENCIES AND MIDDLEWARE
import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import propertiesRouter from './routes/properties-route';
import authRouter from './routes/auth-route';
import connectDB from './db/connectDB';
import notFound from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

const app = express();
dotenv.config();

//NEEDED DEFAULT MIDDLEWARE
app.use(express.json());
app.use(urlencoded({ extended: false }));

const allowedOrgins = [
  'http://localhost:5173',
  'https://houser-navy.vercel.app/',
];
app.use(
  cors({
    credentials: true,
    origin: allowedOrgins,
  })
);

//SETTING UP ROUTERs
app.use('/api/v1/properties', propertiesRouter);
app.use('/api/v1/auth', authRouter);

//ERROR MIDDLEWARE
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
  });
};

start();
