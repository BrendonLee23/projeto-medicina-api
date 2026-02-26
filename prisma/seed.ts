import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Lista oficial de alunos
const studentNames = [
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
  console.log(`📊 Total: ${students.length} alunos cadastrados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
