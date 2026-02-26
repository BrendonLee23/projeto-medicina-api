import { Router } from 'express';
import { MessagesController } from './messages.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const messagesController = new MessagesController();

/**
 * Rotas de mensagens
 */

// POST /messages (rota pública para cadastro de mensagens)
router.post('/', (req, res, next) =>
  messagesController.createMessage(req, res, next)
);

// GET /messages
router.get('/', authMiddleware, (req, res, next) =>
  messagesController.getMessages(req, res, next)
);

// GET /messages/:id
router.get('/:id', authMiddleware, (req, res, next) =>
  messagesController.getMessageById(req, res, next)
);

// PUT /messages/:id
router.put('/:id', authMiddleware, (req, res, next) =>
  messagesController.updateMessage(req, res, next)
);

// DELETE /messages/:id
router.delete('/:id', authMiddleware, (req, res, next) =>
  messagesController.deleteMessage(req, res, next)
);

export default router;
