import { PrismaClient } from '@prisma/client';

/**
 * Instância única do Prisma Client
 * Utilizado para conexão com o banco de dados
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Conecta ao banco de dados
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

/**
 * Desconecta do banco de dados
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('❎ Banco de dados desconectado');
}
