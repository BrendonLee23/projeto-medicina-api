import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Controller para setup do banco de dados
 */
export class SetupController {
  /**
   * POST /setup/database
   * Executa seed do banco de dados
   */
  async setupDatabase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Chave de segurança simples
      const { key } = req.body;
      
      if (key !== 'medicina2026') {
        res.status(403).json({ error: 'Chave inválida' });
        return;
      }

      console.log('🔄 Iniciando seed do banco de dados...');

      // Lista de alunos
      const alunos = [
        "Ana Clara", "Beatriz", "Carlos Eduardo", "Daniel", "Eduardo",
        "Felipe", "Gabriel", "Henrique", "Igor", "João Pedro",
        "Kauã", "Leonardo", "Mateus", "Nicolas", "Otávio",
        "Pedro Henrique", "Rafael", "Samuel", "Thiago", "Vinícius",
        "Alice", "Bruna", "Camila", "Débora", "Emanuela",
        "Fernanda", "Giovanna", "Helena", "Isabela", "Julia",
        "Karen", "Larissa", "Mariana", "Natália", "Olivia",
        "Patricia", "Raquel", "Sofia", "Tatiana", "Valentina",
        "Arthur", "Bruno", "Caio", "Diego", "Enzo",
        "Fabio", "Guilherme", "Hugo", "Isaac", "Lucas",
        "Miguel", "Nathan", "Pablo", "Rodrigo", "Theo",
        "Amanda", "Bianca", "Cecília", "Daniela", "Elisa",
        "Flávia", "Gabriela", "Heloísa", "Ingrid", "Júlia",
        "Luana", "Melissa", "Nina", "Paula", "Renata",
        "Sabrina", "Vitória", "André", "Bernardo", "César",
        "Davi", "Fernando", "Gustavo", "Heitor", "Ivan",
        "José", "Teste"
      ];

      // Criar alunos
      const studentsCreated = [];
      for (const nome of alunos) {
        const student = await prisma.student.upsert({
          where: { name: nome },
          update: {},
          create: { name: nome }
        });
        studentsCreated.push(student);
      }

      console.log(`✅ ${studentsCreated.length} alunos criados`);

      // Criar usuário de teste
      const passwordHash = await bcrypt.hash('Braga', 10);
      const user = await prisma.user.upsert({
        where: { username: 'Aymee' },
        update: {},
        create: {
          username: 'Aymee',
          password: passwordHash,
          role: 'admin'
        }
      });

      console.log('✅ Usuário criado:', user.username);
      console.log('🎉 Seed concluído com sucesso!');

      res.status(200).json({
        success: true,
        message: 'Banco de dados configurado com sucesso!',
        details: {
          studentsCreated: studentsCreated.length,
          userCreated: user.username
        }
      });
    } catch (error) {
      console.error('❌ Erro no setup:', error);
      next(error);
    } finally {
      await prisma.$disconnect();
    }
  }
}
