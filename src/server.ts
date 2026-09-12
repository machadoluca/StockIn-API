import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import dataSource from './database/connection';

import { authRouter } from './routes/auth.route';
import { productRouter } from './routes/products';
import { companyRouter } from './routes/companies';
import { categoriesRouter } from './routes/categories.route';
import { userRouter } from './routes/user.route';
import { forecastRouter } from './routes/forecast.route';
import { salesRouter } from './routes/sales.route';

import { errorMiddleware } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);

// unprotected development routes
app.use('/forecasts', forecastRouter);

// Protected routes
app.use(authMiddleware);
app.use('/sales', salesRouter);
app.use('/products', productRouter);
app.use('/categories', categoriesRouter);
app.use('/companies', companyRouter);

app.use(errorMiddleware);

dataSource
  .initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () =>
      console.log(`HTTP server running on localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));
