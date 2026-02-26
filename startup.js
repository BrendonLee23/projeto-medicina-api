#!/usr/bin/env node
/**
 * Script de inicialização que garante que o banco está configurado
 * antes de iniciar o servidor
 */
const { execSync } = require('child_process');

console.log('🚀 Iniciando aplicação...');

try {
  console.log('📦 Executando migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations executadas com sucesso');
} catch (error) {
  console.log('⚠️  Erro ao executar migrations (pode ser que já estejam aplicadas)');
}

try {
  console.log('🌱 Executando seed...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Seed executado com sucesso');
} catch (error) {
  console.log('⚠️  Erro ao executar seed (pode ser que já tenha dados)');
}

console.log('🎯 Iniciando servidor...');
execSync('node dist/server.js', { stdio: 'inherit' });
