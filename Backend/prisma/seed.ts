import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Lista de 50 nomes brasileiros fictícios
const studentNames = [
  'Ana Clara Silva',
  'João Pedro Santos',
  'Maria Eduarda Oliveira',
  'Lucas Gabriel Costa',
  'Beatriz Ferreira',
  'Gabriel Henrique Lima',
  'Júlia Rodrigues',
  'Rafael Almeida',
  'Larissa Souza',
  'Felipe Martins',
  'Isabela Pereira',
  'Matheus Carvalho',
  'Letícia Gomes',
  'Guilherme Ribeiro',
  'Fernanda Dias',
  'Vinícius Barbosa',
  'Camila Araújo',
  'Bruno Cardoso',
  'Amanda Teixeira',
  'Thiago Monteiro',
  'Carolina Moreira',
  'Rodrigo Castro',
  'Bianca Nascimento',
  'Daniel Mendes',
  'Mariana Cunha',
  'Eduardo Pinto',
  'Aline Rocha',
  'Leonardo Freitas',
  'Natália Vieira',
  'Gustavo Azevedo',
  'Patrícia Cavalcanti',
  'Henrique Nogueira',
  'Vanessa Correia',
  'André Batista',
  'Renata Castro',
  'Carlos Eduardo Duarte',
  'Juliana Farias',
  'Marcelo Barros',
  'Tatiana Moura',
  'Ricardo Nunes',
  'Priscila Campos',
  'Diego Ramos',
  'Adriana Lopes',
  'Paulo Henrique Miranda',
  'Sandra Lima',
  'Fábio Machado',
  'Cristina Torres',
  'Alex Soares',
  'Mônica Pires',
  'Roberto Melo'
];

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar dados existentes
  await prisma.message.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Dados anteriores removidos');

  // Criar usuário Aymee com senha hasheada "Braga"
  const hashedPassword = await bcrypt.hash('Braga', 10);
  
  const user = await prisma.user.create({
    data: {
      username: 'Aymee',
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuário criado: ${user.username}`);

  // Criar 50 alunos
  const students = await Promise.all(
    studentNames.map((name) =>
      prisma.student.create({
        data: { name },
      })
    )
  );

  console.log(`✅ ${students.length} alunos criados`);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
