import { Response, NextFunction } from 'express';
import { MessagesService } from './messages.service';
import {
  createMessageSchema,
  updateMessageSchema,
  getMessagesQuerySchema,
} from './messages.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';

const messagesService = new MessagesService();

/**
 * Controller de mensagens
 * Responsável por receber requisições HTTP e delegar para o service
 */
export class MessagesController {
  /**
   * POST /messages
   * Cria uma nova mensagem
   */
  async createMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validar dados de entrada
      const validatedData = createMessageSchema.parse(req.body);

      // Chamar service
      const message = await messagesService.createMessage(validatedData);

      // Retornar resposta com status 201
      return res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /messages
   * Lista mensagens com paginação
   */
  async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validar query params
      const validatedQuery = getMessagesQuerySchema.parse(req.query);

      // Chamar service
      const result = await messagesService.getMessages(validatedQuery);

      // Retornar resposta
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /messages/:id
   * Busca uma mensagem por ID
   */
  async getMessageById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Chamar service
      const message = await messagesService.getMessageById(id);

      // Retornar resposta
      return res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /messages/:id
   * Atualiza uma mensagem
   */
  async updateMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validar dados de entrada
      const validatedData = updateMessageSchema.parse(req.body);

      // Chamar service
      const message = await messagesService.updateMessage(id, validatedData);

      // Retornar resposta
      return res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /messages/:id
   * Deleta uma mensagem
   */
  async deleteMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Chamar service
      const result = await messagesService.deleteMessage(id);

      // Retornar resposta
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
