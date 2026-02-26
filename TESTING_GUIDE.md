# 🧪 Guia de Teste Passo a Passo

Teste completo da API do zero. Siga em ordem! ✅

---

## ✅ PARTE 1: Setup Inicial

### 📌 Passo 1: Instalar Dependências

```bash
cd Backend
npm install
```

**Resultado esperado:**
```
✓ Pacotes instalados com sucesso
✓ node_modules/ criado
```

---

### 📌 Passo 2: Criar arquivo .env

Crie `.env` na raiz com:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:senha@localhost:5432/projeto_medicina"
JWT_SECRET=minha_chave_secreta_super_segura_12345
JWT_EXPIRES_IN=7d
```

⚠️ **Ajuste a DATABASE_URL conforme seu PostgreSQL!**

---

### 📌 Passo 3: Verificar PostgreSQL

```bash
# Windows (PowerShell)
Get-Service -Name postgresql*

# Deve mostrar "Running"
```

Se não estiver rodando:
```bash
# Inicie o serviço
Start-Service postgresql-x64-15  # Ajuste o nome conforme sua versão
```

---

### 📌 Passo 4: Executar Migrations

```bash
npx prisma migrate dev --name init
```

**Resultado esperado:**
```
✓ Migrations aplicadas
✓ Tabelas criadas: users, students, messages
✓ Prisma Client gerado
```

---

### 📌 Passo 5: Popular Banco de Dados

```bash
npm run prisma:seed
```

**Resultado esperado:**
```
🌱 Iniciando seed...
✅ Dados anteriores removidos
✅ Usuário criado: Aymee
✅ 50 alunos criados
🎉 Seed concluído com sucesso!
```

---

### 📌 Passo 6: Iniciar o Servidor

```bash
npm run dev
```

**Resultado esperado:**
```
✅ Banco de dados conectado com sucesso
🚀 Servidor rodando na porta 3000
📍 URL: http://localhost:3000/api
🏥 Environment: development
```

✅ **Setup concluído!** Deixe o servidor rodando.

---

## ✅ PARTE 2: Testando os Endpoints

Abra um **novo terminal** para executar os testes (deixe o servidor rodando no outro).

### 🧪 Teste 1: Health Check

```bash
curl http://localhost:3000/api/health
```

**✅ Resultado esperado:**
```json
{
  "status": "OK",
  "message": "API está funcionando",
  "timestamp": "2026-02-26T..."
}
```

---

### 🧪 Teste 2: Login

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"Aymee\",\"password\":\"Braga\"}"
```

**✅ Resultado esperado:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "username": "Aymee",
    "createdAt": "2026-02-26T..."
  }
}
```

📋 **COPIE O TOKEN!** Você vai usá-lo nos próximos testes.

Salve em uma variável (PowerShell):
```powershell
$token = "COLE_O_TOKEN_AQUI"
```

---

### 🧪 Teste 3: Listar Alunos (sem token - deve falhar)

```bash
curl http://localhost:3000/api/students
```

**✅ Resultado esperado (ERRO 401):**
```json
{
  "error": "Token não fornecido"
}
```

✅ **Ótimo!** A proteção está funcionando.

---

### 🧪 Teste 4: Listar Alunos (com token)

```bash
# PowerShell
curl http://localhost:3000/api/students -H "Authorization: Bearer $token"
```

**✅ Resultado esperado:**
```json
{
  "students": [
    {
      "id": "uuid-1",
      "name": "Ana Clara Silva",
      "createdAt": "2026-02-26T...",
      "updatedAt": "2026-02-26T..."
    },
    {
      "id": "uuid-2",
      "name": "João Pedro Santos",
      ...
    }
    // ... mais alunos
  ],
  "pagination": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```

📋 **COPIE O ID DE UM ALUNO!** Você vai usar na próxima etapa.

```powershell
$studentId = "COLE_O_ID_AQUI"
```

---

### 🧪 Teste 5: Buscar Aluno por Nome

```bash
curl "http://localhost:3000/api/students?search=ana" -H "Authorization: Bearer $token"
```

**✅ Resultado esperado:**
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "Ana Clara Silva",
      ...
    }
    // Apenas alunos com "ana" no nome
  ],
  "pagination": {
    ...
  }
}
```

---

### 🧪 Teste 6: Criar Mensagem

```bash
# PowerShell
$body = @{
  studentId = $studentId
  familyName = "Silva"
  relationship = "Mãe"
  message = "Querido filho, estou muito orgulhosa do seu progresso neste semestre. Continue se dedicando!"
} | ConvertTo-Json

curl -X POST http://localhost:3000/api/messages -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $body
```

**✅ Resultado esperado (201 Created):**
```json
{
  "id": "message-uuid",
  "studentId": "student-uuid",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Querido filho, estou muito orgulhosa...",
  "createdAt": "2026-02-26T...",
  "updatedAt": "2026-02-26T...",
  "student": {
    "id": "student-uuid",
    "name": "Ana Clara Silva"
  }
}
```

📋 **COPIE O ID DA MENSAGEM!**

```powershell
$messageId = "COLE_O_ID_AQUI"
```

---

### 🧪 Teste 7: Listar Mensagens

```bash
curl "http://localhost:3000/api/messages?page=1&limit=10" -H "Authorization: Bearer $token"
```

**✅ Resultado esperado:**
```json
{
  "messages": [
    {
      "id": "message-uuid",
      "studentId": "student-uuid",
      "familyName": "Silva",
      "relationship": "Mãe",
      "message": "Querido filho...",
      "createdAt": "2026-02-26T...",
      "updatedAt": "2026-02-26T...",
      "student": {
        "id": "student-uuid",
        "name": "Ana Clara Silva"
      }
    }
  ],
  "pagination": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```

---

### 🧪 Teste 8: Buscar Mensagem por ID

```bash
curl "http://localhost:3000/api/messages/$messageId" -H "Authorization: Bearer $token"
```

**✅ Resultado esperado:**
```json
{
  "id": "message-uuid",
  "studentId": "student-uuid",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Querido filho...",
  "createdAt": "2026-02-26T...",
  "updatedAt": "2026-02-26T...",
  "student": {
    "id": "student-uuid",
    "name": "Ana Clara Silva"
  }
}
```

---

### 🧪 Teste 9: Atualizar Mensagem

```bash
# PowerShell
$updateBody = @{
  message = "Mensagem atualizada! Continue assim, filho querido!"
} | ConvertTo-Json

curl -X PUT "http://localhost:3000/api/messages/$messageId" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $updateBody
```

**✅ Resultado esperado (200 OK):**
```json
{
  "id": "message-uuid",
  "studentId": "student-uuid",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Mensagem atualizada! Continue assim, filho querido!",
  "createdAt": "2026-02-26T...",
  "updatedAt": "2026-02-26T...",  // ← Atualizado!
  "student": {
    "id": "student-uuid",
    "name": "Ana Clara Silva"
  }
}
```

---

### 🧪 Teste 10: Deletar Mensagem

```bash
curl -X DELETE "http://localhost:3000/api/messages/$messageId" -H "Authorization: Bearer $token"
```

**✅ Resultado esperado (200 OK):**
```json
{
  "message": "Mensagem deletada com sucesso"
}
```

---

### 🧪 Teste 11: Verificar que Mensagem Foi Deletada

```bash
curl "http://localhost:3000/api/messages/$messageId" -H "Authorization: Bearer $token"
```

**✅ Resultado esperado (404 Not Found):**
```json
{
  "error": "Mensagem não encontrada"
}
```

✅ **Perfeito! A mensagem foi deletada.**

---

## ✅ PARTE 3: Testando Validações

### 🧪 Teste 12: Login com Credenciais Inválidas

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"Aymee\",\"password\":\"SenhaErrada\"}"
```

**✅ Resultado esperado (401):**
```json
{
  "error": "Credenciais inválidas"
}
```

---

### 🧪 Teste 13: Criar Mensagem com Mais de 900 Caracteres

```bash
# PowerShell
$longMessage = "a" * 901
$invalidBody = @{
  studentId = $studentId
  familyName = "Silva"
  relationship = "Mãe"
  message = $longMessage
} | ConvertTo-Json

curl -X POST http://localhost:3000/api/messages -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $invalidBody
```

**✅ Resultado esperado (400 Bad Request):**
```json
{
  "error": "Erro de validação",
  "details": [
    {
      "field": "message",
      "message": "Mensagem deve ter no máximo 900 caracteres"
    }
  ]
}
```

---

### 🧪 Teste 14: Criar Mensagem para Aluno Inexistente

```bash
# PowerShell
$invalidStudentBody = @{
  studentId = "00000000-0000-0000-0000-000000000000"
  familyName = "Silva"
  relationship = "Mãe"
  message = "Teste"
} | ConvertTo-Json

curl -X POST http://localhost:3000/api/messages -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d $invalidStudentBody
```

**✅ Resultado esperado (404):**
```json
{
  "error": "Aluno não encontrado"
}
```

---

## ✅ PARTE 4: Verificando o Banco de Dados

### 📌 Abrir Prisma Studio

```bash
npx prisma studio
```

Isso abrirá uma interface visual em `http://localhost:5555`

**Verifique:**
- ✅ Tabela `users` tem 1 usuário (Aymee)
- ✅ Tabela `students` tem 50 alunos
- ✅ Tabela `messages` tem as mensagens criadas

---

## 🎉 TODOS OS TESTES PASSARAM!

### ✅ Checklist Final

- [x] ✅ Health check funciona
- [x] ✅ Login retorna JWT
- [x] ✅ Rotas protegidas exigem token
- [x] ✅ Listar alunos funciona
- [x] ✅ Buscar alunos por nome funciona
- [x] ✅ Paginação funciona
- [x] ✅ Criar mensagem funciona
- [x] ✅ Listar mensagens funciona
- [x] ✅ Buscar mensagem por ID funciona
- [x] ✅ Atualizar mensagem funciona
- [x] ✅ Deletar mensagem funciona
- [x] ✅ Validação de 900 caracteres funciona
- [x] ✅ Validação de aluno existente funciona
- [x] ✅ Validação de credenciais funciona
- [x] ✅ Prisma Studio mostra dados corretos

---

## 🚀 Próximos Passos

Agora que a API está funcionando perfeitamente:

1. ✅ Integre com o frontend
2. ✅ Use a coleção Postman (postman-collection.json)
3. ✅ Use os tipos TypeScript (api-types.ts)
4. ✅ Consulte EXAMPLES.md para mais exemplos
5. ✅ Consulte DEPLOYMENT.md para deploy em produção

---

## 🐛 Troubleshooting

### ❌ Erro: "Can't reach database server"

**Solução:** Verifique se o PostgreSQL está rodando:
```bash
Get-Service postgresql*
```

### ❌ Erro: "Token expirado"

**Solução:** Faça login novamente para obter um novo token.

### ❌ Erro: "Port 3000 is already in use"

**Solução:** Pare o processo que está usando a porta ou altere a porta no `.env`:
```env
PORT=3001
```

---

**🎉 API totalmente funcional e testada! Happy Coding! 🚀**
