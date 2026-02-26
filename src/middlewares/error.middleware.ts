import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Middleware global de tratamento de erros
 * Captura erros e retorna resposta padronizada
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro no servidor (em produção, usar um logger apropriado)
  console.error('❌ Erro capturado:', error);

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Erro de validação',
      details: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Erro customizado com status code
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  // Erro genérico
  return res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};

/**
 * Classe para criar erros customizados com status code
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}
