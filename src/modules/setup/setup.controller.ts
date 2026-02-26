import { Request, Response } from 'express';
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
  async setupDatabase(req: Request, res: Response): Promise<void> {
    try {
      // Chave de segurança simples
      const { key } = req.body;
      
      if (key !== 'medicina2026') {
        res.status(403).json({ error: 'Chave inválida' });
        return;
      }

      console.log('🔄 Iniciando setup do banco de dados...');

      // Testar conexão
      await prisma.$connect();
      console.log('✅ Conectado ao banco de dados');

      // Criar tabelas (via SQL raw para PostgreSQL)
      try {
        console.log('📦 Criando tabelas...');
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT NOT NULL,
            "username" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "users_pkey" PRIMARY KEY ("id")
          );
        `;

        await prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
        `;

        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "students" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "students_pkey" PRIMARY KEY ("id")
          );
        `;

        await prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "students_name_idx" ON "students"("name");
        `;

        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "messages" (
            "id" TEXT NOT NULL,
            "studentId" TEXT NOT NULL,
            "familyName" TEXT NOT NULL,
            "relationship" TEXT NOT NULL,
            "message" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "messages_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "messages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `;

        console.log('✅ Tabelas criadas com sucesso');
      } catch (error: any) {
        // Se der erro de tabela já existir, ignorar
        if (error.code === '42P07') {
          console.log('ℹ️  Tabelas já existem');
        } else {
          throw error;
        }
      }

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

      // Criar alunos (verificar se já existem)
      const studentsCreated = [];
      for (const nome of alunos) {
        const existing = await prisma.student.findFirst({
          where: { name: nome }
        });
        
        if (!existing) {
          const student = await prisma.student.create({
            data: { name: nome }
          });
          studentsCreated.push(student);
        } else {
          console.log(`ℹ️  Aluno já existe: ${nome}`);
        }
      }

      console.log(`✅ ${studentsCreated.length} novos alunos criados`);

      // Verificar total de alunos
      const totalStudents = await prisma.student.count();
      console.log(`📊 Total de alunos no banco: ${totalStudents}`);

      // Criar usuário de teste
      const passwordHash = await bcrypt.hash('Braga', 10);
      const existingUser = await prisma.user.findUnique({
        where: { username: 'Aymee' }
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: {
            username: 'Aymee',
            password: passwordHash
          }
        });
        console.log('✅ Usuário criado:', user.username);
      } else {
        console.log('ℹ️  Usuário Aymee já existe');
      }

      // Contar mensagens
      const totalMessages = await prisma.message.count();
      console.log(`📧 Total de mensagens no banco: ${totalMessages}`);

      console.log('🎉 Seed concluído com sucesso!');

      res.status(200).json({
        success: true,
        message: 'Banco de dados configurado com sucesso!',
        details: {
          newStudentsCreated: studentsCreated.length,
          totalStudents,
          totalMessages,
          userExists: !!existingUser
        }
      });
    } catch (error) {
      console.error('❌ Erro no setup:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
