import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import studentsRoutes from './modules/students/students.routes';
import messagesRoutes from './modules/messages/messages.routes';
import setupRoutes from './modules/setup/setup.routes';

const router = Router();

/**
 * Configuração centralizada de todas as rotas da aplicação
 */

// Rota de health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
  });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de alunos
router.use('/students', studentsRoutes);

// Rotas de mensagens
router.use('/messages', messagesRoutes);

// Rota de setup (apenas para primeira configuração)
router.use('/setup', setupRoutes);

export default router;
