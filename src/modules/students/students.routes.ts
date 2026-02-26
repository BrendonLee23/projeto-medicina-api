import { Router } from 'express';
import { StudentsController } from './students.controller';

const router = Router();
const studentsController = new StudentsController();

/**
 * Rotas de alunos (públicas para permitir criação de mensagens)
 */

// GET /students
router.get('/', (req, res, next) => 
  studentsController.getStudents(req, res, next)
);

export default router;
