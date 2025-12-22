import type { Request, Response } from 'express';
import z from 'zod';

import { DataSource } from '../database/connection';
import User from '../entities/user';

class AuthController {
  public async authenticate(request: Request, response: Response) {
    const authSchema = z.object({
      email: z.email(),
      password: z.string()
    });

    const { email, password } = authSchema.parse(request.body);

    const user = await DataSource.getRepository(User).findOneBy({ email });

    return response.status(200).json(user ?? { message: 'User not found' });
  }
}

export default AuthController;
