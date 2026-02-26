import { PrismaClient } from '@prisma/client';

/**
 * Instância única do Prisma Client
 * Utilizado para conexão com o banco de dados
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/**
 * Conecta ao banco de dados
 */
export async function connectDatabase() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    // Timeout de 10 segundos para conectar
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout ao conectar ao banco')), 10000)
    );
    
    await Promise.race([
      prisma.$connect(),
      timeoutPromise
    ]);
    
    console.log('✅ Banco de dados conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');
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
