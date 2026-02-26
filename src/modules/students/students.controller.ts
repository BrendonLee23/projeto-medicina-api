import { Response, NextFunction } from 'express';
import { StudentsService } from './students.service';
import { getStudentsQuerySchema } from './students.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';

const studentsService = new StudentsService();

/**
 * Controller de alunos
 * Responsável por receber requisições HTTP e delegar para o service
 */
export class StudentsController {
  /**
   * GET /students
   * Lista alunos com filtro opcional e paginação
   */
  async getStudents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validar query params
      const validatedQuery = getStudentsQuerySchema.parse(req.query);

      // Chamar service
      const result = await studentsService.getStudents(validatedQuery);

      // Retornar resposta
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
