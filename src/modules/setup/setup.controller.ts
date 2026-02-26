import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Controller para setup do banco de dados
 */
export class SetupController {
  /**
   * POST /setup/database
   * Executa migrations e seed
   */
  async setupDatabase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Chave de segurança simples
      const { key } = req.body;
      
      if (key !== 'medicina2026') {
        res.status(403).json({ error: 'Chave inválida' });
        return;
      }

      console.log('🔄 Iniciando setup do banco de dados...');

      // Executar migrations
      console.log('📦 Executando migrations...');
      const migrateResult = await execAsync('npx prisma migrate deploy');
      console.log('✅ Migrations executadas:', migrateResult.stdout);

      // Executar seed
      console.log('🌱 Executando seed...');
      const seedResult = await execAsync('npx prisma db seed');
      console.log('✅ Seed executado:', seedResult.stdout);

      res.status(200).json({
        success: true,
        message: 'Banco de dados configurado com sucesso!',
        details: {
          migrations: migrateResult.stdout,
          seed: seedResult.stdout
        }
      });
    } catch (error) {
      console.error('❌ Erro no setup:', error);
      next(error);
    }
  }
}
