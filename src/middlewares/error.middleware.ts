import type { ErrorRequestHandler } from 'express';
import { z, ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (
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
  console.log(error);
  return response.status(500).json({ message: 'Internal Server Error' });
};
