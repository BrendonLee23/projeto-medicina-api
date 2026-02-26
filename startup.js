#!/usr/bin/env node
/**
 * Script de inicialização que garante que o banco está configurado
 * antes de iniciar o servidor
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando setup do banco...');

    // Criar tabelas se não existirem
    console.log('📦 Criando tabelas...');
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "password" TEXT NOT NULL,
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'messages_studentId_fkey'
        ) THEN
          ALTER TABLE "messages" ADD CONSTRAINT "messages_studentId_fkey" 
          FOREIGN KEY ("studentId") REFERENCES "students"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `;

    console.log('✅ Tabelas criadas/verificadas');

    // Inserir dados iniciais
    const studentCount = await prisma.student.count();
    
    if (studentCount === 0) {
      console.log('🌱 Inserindo dados iniciais...');
      
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

      for (const nome of alunos) {
        await prisma.student.create({ data: { name: nome } });
      }

      console.log(`✅ ${alunos.length} alunos criados`);

      // Criar usuário
      const passwordHash = await bcrypt.hash('Braga', 10);
      await prisma.user.create({
        data: {
          username: 'Aymee',
          password: passwordHash
        }
      });

      console.log('✅ Usuário Aymee criado');
    } else {
      console.log(`ℹ️  Banco já contém ${studentCount} alunos`);
    }

    console.log('🎉 Setup concluído!');

  } catch (error) {
    console.error('❌ Erro no setup:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar setup e depois iniciar servidor
setupDatabase().then(() => {
  console.log('🎯 Iniciando servidor...');
  require('./dist/server.js');
}).catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
