import { Router } from 'express';
import { MessagesController } from './messages.controller';

const router = Router();
const messagesController = new MessagesController();

/**
 * Rotas de mensagens
 */

// POST /messages (rota pública para cadastro de mensagens)
router.post('/', (req, res, next) =>
  messagesController.createMessage(req, res, next)
);

// GET /messages (rota pública para listar mensagens)
router.get('/', (req, res, next) =>
  messagesController.getMessages(req, res, next)
);

// GET /messages/:id (rota pública)
router.get('/:id', (req, res, next) =>
  messagesController.getMessageById(req, res, next)
);

// PUT /messages/:id (rota pública)
router.put('/:id', (req, res, next) =>
  messagesController.updateMessage(req, res, next)
);

// DELETE /messages/:id (rota pública)
router.delete('/:id', (req, res, next) =>
  messagesController.deleteMessage(req, res, next)
);

export default router;
