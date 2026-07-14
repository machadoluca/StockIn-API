import type { Request, Response } from 'express';
import z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { DataSource } from '../database/connection';
import User from '../entities/user';
import AppError from '../utils/error';

class AuthController {
  public async login(request: Request, response: Response) {
    const authSchema = z.object({
      email: z.email(),
      password: z.string(),
    });

    const { email, password } = authSchema.parse(request.body);

    const user = await DataSource.getRepository(User).findOneBy({ email });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // const comparePassword = await bcrypt.compare(password, user.password);

    // if (!comparePassword) throw new AppError("Invalid email or password", 401);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY!,
      { expiresIn: '1d' },
    );

    return response.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
}

export default AuthController;
