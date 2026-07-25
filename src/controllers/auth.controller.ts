import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import z from 'zod';

import DataSource from '../database/connection';
import User from '../entities/user';
import AppError from '../utils/error';

class AuthController {
  public async login(request: Request, response: Response) {
    const authSchema = z.object({
      email: z.email(),
      password: z.string()
    });

    const { email, password } = authSchema.parse(request.body);

    const user = await DataSource.getRepository(User).findOneBy({ email });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) throw new AppError('Invalid email or password', 401);

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_KEY!,
      { expiresIn: '1d' }
    );

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY!,
      { expiresIn: '1h' }
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
  }

  public async refresh(request: Request, response: Response) {}
}

export default AuthController;
