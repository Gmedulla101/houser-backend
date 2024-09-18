//IMPORTING NEEDED DEPENDENCIES AND MIDDLEWARE
import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import propertiesRouter from './routes/properties-route';
import authRouter from './routes/auth-route';
import connectDB from './db/connectDB';
import notFound from './middleware/not-found';

const app = express();
dotenv.config();

//NEEDED DEFAULT MIDDLEWARE
app.use(express.json());
app.use(urlencoded({ extended: false }));

//SETTING UP ROUTERs
app.use('/api/v1/properties', propertiesRouter);
app.use('/api/v1/auth', authRouter);

//ERROR MIDDLEWARE
app.use(notFound);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
  });
};

start();
