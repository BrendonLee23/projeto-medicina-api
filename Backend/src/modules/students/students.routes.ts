import { Router } from 'express';
import { StudentsController } from './students.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const studentsController = new StudentsController();

/**
 * Rotas de alunos (todas protegidas por autenticação)
 */

// GET /students
router.get('/', authMiddleware, (req, res, next) => 
  studentsController.getStudents(req, res, next)
);

export default router;
