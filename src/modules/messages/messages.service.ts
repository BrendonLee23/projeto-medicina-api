import { MessagesRepository } from './messages.repository';
import { StudentsRepository } from '../students/students.repository';
import {
  CreateMessageInput,
  UpdateMessageInput,
  GetMessagesQuery,
} from './messages.validation';
import { AppError } from '../../middlewares/error.middleware';

const messagesRepository = new MessagesRepository();
const studentsRepository = new StudentsRepository();

/**
 * Service de mensagens
 * Responsável pela lógica de negócio
 */
export class MessagesService {
  /**
   * Cria uma nova mensagem
   * @param data - Dados da mensagem
   */
  async createMessage(data: CreateMessageInput) {
    // Verificar se o aluno existe
    const student = await studentsRepository.findById(data.studentId);

    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }

    // Criar mensagem
    const message = await messagesRepository.create(data);

    return message;
  }

  /**
   * Lista mensagens com paginação
   * @param query - Parâmetros de paginação
   */
  async getMessages(query: GetMessagesQuery) {
    const { page, limit } = query;

    const result = await messagesRepository.findMany(page, limit);

    return result;
  }

  /**
   * Busca uma mensagem por ID
   * @param id - ID da mensagem
   */
  async getMessageById(id: string) {
    const message = await messagesRepository.findById(id);

    if (!message) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    return message;
  }

  /**
   * Atualiza uma mensagem
   * @param id - ID da mensagem
   * @param data - Dados para atualizar
   */
  async updateMessage(id: string, data: UpdateMessageInput) {
    // Verificar se a mensagem existe
    const existingMessage = await messagesRepository.findById(id);

    if (!existingMessage) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    // Atualizar mensagem
    const updatedMessage = await messagesRepository.update(id, data);

    return updatedMessage;
  }

  /**
   * Deleta uma mensagem
   * @param id - ID da mensagem
   */
  async deleteMessage(id: string) {
    // Verificar se a mensagem existe
    const existingMessage = await messagesRepository.findById(id);

    if (!existingMessage) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    // Deletar mensagem
    await messagesRepository.delete(id);

    return { message: 'Mensagem deletada com sucesso' };
  }
}
