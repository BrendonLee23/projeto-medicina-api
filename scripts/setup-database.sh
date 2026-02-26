#!/bin/bash
# Script para configurar o banco de dados em produção

echo "🔄 Executando migrations..."
npx prisma migrate deploy

echo "🌱 Executando seed..."
npx prisma db seed

echo "✅ Setup do banco de dados concluído!"
