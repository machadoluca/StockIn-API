import type { ErrorRequestHandler } from 'express';
import { z, ZodError } from 'zod';
import AppError from '../utils/error';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation error',
      errors: z.treeifyError(error)
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  console.error(error);
  return response.status(500).json({
    message: 'Internal server error'
  });
};
