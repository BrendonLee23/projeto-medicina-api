import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMessages() {
  try {
    console.log('🧪 Testando banco de dados...\n');

    // 1. Verificar se tem alunos
    const students = await prisma.student.findMany();
    console.log(`✅ Total de alunos: ${students.length}`);
    console.log(`   Primeiro aluno: ${students[0]?.name} (ID: ${students[0]?.id})\n`);

    // 2. Criar uma mensagem de teste
    const testStudent = students[0];
    if (testStudent) {
      const newMessage = await prisma.message.create({
        data: {
          studentId: testStudent.id,
          familyName: 'Maria Silva',
          relationship: 'mãe',
          message: 'Mensagem de teste para validação do sistema'
        }
      });
      console.log(`✅ Mensagem criada com sucesso!`);
      console.log(`   ID: ${newMessage.id}`);
      console.log(`   Aluno: ${testStudent.name}`);
      console.log(`   Familiar: ${newMessage.familyName}`);
      console.log(`   Parentesco: ${newMessage.relationship}\n`);
    }

    // 3. Listar todas as mensagens
    const messages = await prisma.message.findMany({
      include: {
        student: true
      }
    });

    console.log(`✅ Total de mensagens no banco: ${messages.length}\n`);
    
    if (messages.length > 0) {
      console.log('📋 Mensagens cadastradas:');
      messages.forEach((msg, index) => {
        console.log(`\n   ${index + 1}. Aluno: ${msg.student.name}`);
        console.log(`      Familiar: ${msg.familyName} (${msg.relationship})`);
        console.log(`      Mensagem: ${msg.message.substring(0, 50)}...`);
      });
    }

    console.log('\n✅ Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMessages();
