import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * Rotas de autenticação
 */

// POST /auth/login
router.post('/login', (req, res, next) => authController.login(req, res, next));

export default router;
