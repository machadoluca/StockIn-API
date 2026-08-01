import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/error';

export const authMiddleware: RequestHandler = (request, _, next) => {
  const { authorization } = request.headers;

  if (!authorization) throw new AppError('usuário não autorizado', 401);

  const [, token] = authorization.split(' ');

  if (!token) throw new AppError('usuário não autorizado', 401);

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY!);
    request.user = payload as { id: string; companyId: string };

    next();
  } catch (error) {
    throw new AppError('token inválido', 401);
  }
};
