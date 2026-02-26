import { PrismaClient } from '@prisma/client';
import { CreateMessageInput, UpdateMessageInput } from './messages.validation';

const prisma = new PrismaClient();

/**
 * Repository de mensagens
 * Responsável pelo acesso ao banco de dados
 */
export class MessagesRepository {
  /**
   * Cria uma nova mensagem
   * @param data - Dados da mensagem
   */
  async create(data: CreateMessageInput) {
    return prisma.message.create({
      data,
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Lista mensagens com paginação
   * @param page - Número da página
   * @param limit - Itens por página
   */
  async findMany(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [messages, totalItems] = await Promise.all([
      prisma.message.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.message.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      messages,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Busca uma mensagem por ID
   * @param id - ID da mensagem
   */
  async findById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Atualiza uma mensagem
   * @param id - ID da mensagem
   * @param data - Dados para atualizar
   */
  async update(id: string, data: UpdateMessageInput) {
    return prisma.message.update({
      where: { id },
      data,
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Deleta uma mensagem
   * @param id - ID da mensagem
   */
  async delete(id: string) {
    return prisma.message.delete({
      where: { id },
    });
  }
}
