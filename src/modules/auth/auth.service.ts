import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginInput } from './auth.validation';
import { AppError } from '../../middlewares/error.middleware';

const prisma = new PrismaClient();

/**
 * Service de autenticação
 * Responsável pela lógica de negócio relacionada ao login
 */
export class AuthService {
  /**
   * Realiza o login do usuário
   * @param data - Dados de login (username e password)
   * @returns Objeto com accessToken e dados do usuário
   */
  async login(data: LoginInput) {
    const { username, password } = data;

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar JWT token
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError('Configuração de JWT ausente', 500);
    }

    // Define explicitamente as opções para evitar problemas de tipo do TypeScript
    const signOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };

    const accessToken = jwt.sign(
      { userId: user.id }, 
      secret, 
      signOptions as jwt.SignOptions
    );

    // Retornar token e dados básicos do usuário (sem a senha)
    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }
}
