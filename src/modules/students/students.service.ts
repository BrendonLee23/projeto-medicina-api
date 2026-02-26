import { StudentsRepository } from './students.repository';
import { GetStudentsQuery } from './students.validation';

const studentsRepository = new StudentsRepository();

/**
 * Service de alunos
 * Responsável pela lógica de negócio
 */
export class StudentsService {
  /**
   * Lista alunos com filtro e paginação
   * @param query - Parâmetros de busca e paginação
   */
  async getStudents(query: GetStudentsQuery) {
    const { search, page, limit } = query;

    const result = await studentsRepository.findMany(search, page, limit);

    return result;
  }
}
