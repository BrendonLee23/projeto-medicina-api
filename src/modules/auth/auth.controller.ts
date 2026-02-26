import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { loginSchema } from './auth.validation';

const authService = new AuthService();

/**
 * Controller de autenticação
 * Responsável por receber requisições HTTP e delegar para o service
 */
export class AuthController {
  /**
   * POST /auth/login
   * Realiza login do usuário
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validar dados de entrada com Zod
      const validatedData = loginSchema.parse(req.body);

      // Chamar service para realizar login
      const result = await authService.login(validatedData);

      // Retornar resposta com status 200
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
