import type { RequestHandler } from 'express';

export const authenticate: RequestHandler = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    response.status(403).send({ message: 'usuário não autorizado' });
    return;
  }
  const [, token] = authorization.split(' ');

  if (!process.env.SECRET_KEY) throw new Error('Erro interno');

  try {
    const isValid = jwt.verify(token, process.env.SECRET_KEY);
    if (isValid) next();
  } catch (error: any) {
    throw new Error('Token expirado');
  }
};
