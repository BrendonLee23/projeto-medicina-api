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

    // Verificar se precisamos atualizar os dados
    const studentCount = await prisma.student.count();
    const expectedCount = 78;
    
    // Se o número de alunos for diferente do esperado, ou se não houver alunos, recriar
    if (studentCount !== expectedCount) {
      console.log(`🔄 Atualizando dados (${studentCount} alunos encontrados, esperado ${expectedCount})...`);
      
      // Deletar mensagens e alunos antigos
      await prisma.message.deleteMany({});
      await prisma.student.deleteMany({});
      
      console.log('🌱 Inserindo alunos com nomes completos...');
      
      const alunos = [
        'Agnaldo Soeiro Souza Junior',
        'Ana Beatriz Mota Castelo',
        'Ana Carolina Paes Pessoa',
        'Ana Clara Moraes Mota',
        'Annie Kamilly Souza Lima',
        'Aurida Rodrigues Gomes',
        'Aymée Braga Barros',
        'Beatriz Ferreira Fonseca',
        'Camila Oliveira Diniz de Lima',
        'Camilly Guimarães da Silva Batalha',
        'Carla Emanuelle Nascimento de Medeiros',
        'Caroline Cristine Almeida Balieiro',
        'Christian Canto da Silva',
        'Daniel da Silva Motta',
        'Danilo Lemos Reis',
        'David França Ferreira Cruz',
        'Daylla Victoria Santos Pinheiro',
        'Derick Mourão Januário de Oliveira',
        'Edmilton Freire dos Santos Filho',
        'Eduardo Vieira Silva',
        'Eliaquim Ferreira Alves',
        'Elias Emanuel Leite de Oliveira',
        'Emanuelle Campos Amaral',
        'Fernanda Almeida Carvalho',
        'Flavia Thaíssa Gurgel Avelino',
        'Francilane Lomas da Costa Oliveira',
        'Gabriel Barroso Figueira',
        'Gabriel Cursino Calheiros de Oliveira',
        'Gabriel Silva Fernandes',
        'Gabriela de Lima Galúcio',
        'Gabriela Rodrigues da Silva',
        'Geovana Vitória Nogueira de Paula',
        'Geovanna Mendes Franco',
        'Giovanna Maia Oliveira',
        'Giovanna Neves Mergulhão',
        'Giovanna Vitória Correa de Vasconcelos',
        'Isabella Benayon Carneiro',
        'Isabella Gadelha Krauss',
        'Isadora Mar Levinthal',
        'Isadora Mousinho Pereira de Oliveira',
        'Jansen Barbosa Rocha',
        'Jessica de Jesus Fontoura Luciana',
        'João Victor Braga Nascimento',
        'Julia de Moura Paoleschi',
        'Julia Mariana de Souza Moraes',
        'Julio Cesar Santos Benoliel',
        'Julya Kemily Jaime de Morais',
        'Karen Saldanha Costa Taveira',
        'Karina Dantas Pessoa',
        'Leonardo de Souza Rodrigues',
        'Leonardo German Gimenez',
        'Leonardo Oliveira de Souza',
        'Louise Mariana Ciacci do Vale Barros',
        'Luiz Alberto Nascimento Vilhena',
        'Luiza Vieira Werneck',
        'Manuella Martins de Oliveira',
        'Maran Valerio Pinto',
        'Marcelo Justino da Costa',
        'Marco Antonio Moleiro Baima Junior',
        'Marcus Vinicius Coelho Ribeiro',
        'Maria Luisa de Castro Souza',
        'Mariana Lobato Felix',
        'Mariana Rodrigues da Costa Guimarães',
        'Matheus da Silva Siqueira',
        'Mathews Rezende da Costa',
        'Moisés Salomão Campos de Castro',
        'Paloma Rachel Aquino de Medeiros',
        'Pedro Eduardo Garcia de Andrade',
        'Rafael Lima de Oliveira',
        'Richeury Mota da Silva',
        'Robert Batalha de Paula',
        'Samira Cordovil Silva',
        'Taliny Avelino Guerrero',
        'Victor Felipe Cerma Fernandez',
        'Victor Gabriel de Alencar Ribeiro',
        'Vinicius Moura de Araujo',
        'Xayane da Silva Rebouças',
        'Teste'
      ];

      for (const nome of alunos) {
        await prisma.student.create({ data: { name: nome } });
      }

      console.log(`✅ ${alunos.length} alunos criados`);
    } else {
      console.log(`ℹ️  Banco já contém ${studentCount} alunos (esperado: ${expectedCount})`);
    }
    
    // Criar usuário se não existir
    const userExists = await prisma.user.findUnique({ where: { username: 'Aymee' } });
    if (!userExists) {
      const passwordHash = await bcrypt.hash('Braga', 10);
      await prisma.user.create({
        data: {
          username: 'Aymee',
          password: passwordHash
        }
      });
      console.log('✅ Usuário Aymee criado');
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
