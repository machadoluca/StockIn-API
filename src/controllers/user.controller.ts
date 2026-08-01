import type { Request, Response } from 'express';
import type { Repository } from 'typeorm';

import z from 'zod';
import bcrypt from 'bcryptjs';

import User from '../entities/user';

class UserController {
  constructor(private readonly userRepository: Repository<User>) {}

  public create = async (request: Request, response: Response) => {
    const createSchema = z.object({
      email: z.email(),
      name: z.string().min(1),
      password: z.string().min(6)
    });

    const { email, name, password } = createSchema.parse(request.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword
    });

    await this.userRepository.save(user);

    return response.status(201).json({ message: 'User created successfully' });
  };
  public async delete(request: Request, response: Response) {}
}

export default UserController;
