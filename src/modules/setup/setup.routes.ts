import { Router } from 'express';
import { SetupController } from './setup.controller';

const router = Router();
const setupController = new SetupController();

// Rota pública para setup do banco
router.post('/database', (req, res) => setupController.setupDatabase(req, res));

export default router;
