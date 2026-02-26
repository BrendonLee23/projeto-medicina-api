import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estende o tipo Request do Express para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Interface que pode ser usada nos controllers
export interface AuthRequest extends Request {
  userId?: string;
}

// Payload do JWT
interface JwtPayload {
  userId: string;
}

/**
 * Middleware de autenticação JWT
 * Verifica se o token enviado no header Authorization é válido
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não fornecido',
      });
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({
        error: 'Formato de token inválido',
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: 'Token mal formatado',
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Adiciona o userId ao request para uso nas rotas
    req.userId = decoded.userId;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Token inválido',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expirado',
      });
    }

    return res.status(500).json({
      error: 'Erro ao validar token',
    });
  }
};
