import type { Request, Response } from 'express';
import type { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import z from 'zod';

import User from '../entities/user';
import AppError from '../utils/error';

class AuthController {
  constructor(private readonly userRepository: Repository<User>) {}

  login = async (request: Request, response: Response) => {
    const authSchema = z.object({
      email: z.email(),
      password: z.string()
    });

    const { email, password } = authSchema.parse(request.body);

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company']
    });

    if (!user) throw new AppError('Usuário não encontrado', 401);

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) throw new AppError('Email ou senha Inválidos', 401);

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_KEY!,
      { expiresIn: '1d' }
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        companyId: user.company.id
      },
      process.env.SECRET_KEY!,
      { expiresIn: '2h' }
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return response.status(200).json({
      message: 'Authentication successful',
      accessToken: accessToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  };

  refresh = async (request: Request, response: Response) => {};
}

export default AuthController;
