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
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está configurada nas variáveis de ambiente');
    }
    
    // Mostra informações da connection string (sem senha)
    const dbUrl = process.env.DATABASE_URL;
    const sanitized = dbUrl.replace(/:[^:@]+@/, ':***@');
    console.log(`   Connection string: ${sanitized}`);
    
    // Timeout de 15 segundos para conectar
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout ao conectar ao banco (15s)')), 15000)
    );
    
    await Promise.race([
      prisma.$connect(),
      timeoutPromise
    ]);
    
    // Testa a conexão
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Banco de dados conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    console.error('   Detalhes:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Desconecta do banco de dados
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('❎ Banco de dados desconectado');
}
