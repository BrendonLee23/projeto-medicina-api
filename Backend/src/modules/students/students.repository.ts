import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Repository de alunos
 * Responsável pelo acesso ao banco de dados
 */
export class StudentsRepository {
  /**
   * Busca alunos com filtro opcional por nome e paginação
   * @param search - Termo de busca opcional (filtra por nome)
   * @param page - Número da página (padrão: 1)
   * @param limit - Itens por página (padrão: 10)
   */
  async findMany(search?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Construir where clause
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    // Buscar alunos com paginação
    const [students, totalItems] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.student.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      students,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Busca um aluno por ID
   * @param id - ID do aluno
   */
  async findById(id: string) {
    return prisma.student.findUnique({
      where: { id },
    });
  }
}
