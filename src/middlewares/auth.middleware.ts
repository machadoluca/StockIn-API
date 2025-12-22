import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/error';

export const authMiddleware: RequestHandler = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    response.status(403).send({ message: 'usuário não autorizado' });
    return;
  }
  const [, token] = authorization.split(' ');

  if (!token) {
    response.status(403).send({ message: 'usuário não autorizado' });
    return;
  }

  try {
    const isValid = jwt.verify(token, process.env.SECRET_KEY!);
    if (isValid) next();
  } catch (error: any) {
    throw new AppError('Invalid token', 401);
  }
};
