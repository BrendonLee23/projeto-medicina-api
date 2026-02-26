# 🏥 API REST - Projeto Medicina

API REST completa desenvolvida em **Node.js + TypeScript** para gerenciamento de mensagens de alunos.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Prisma ORM** - ORM para banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variáveis de ambiente

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── database.ts          # Configuração do Prisma
├── modules/
│   ├── auth/                # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   └── auth.routes.ts
│   ├── students/            # Módulo de alunos
│   │   ├── students.controller.ts
│   │   ├── students.service.ts
│   │   ├── students.repository.ts
│   │   ├── students.validation.ts
│   │   └── students.routes.ts
│   └── messages/            # Módulo de mensagens
│       ├── messages.controller.ts
│       ├── messages.service.ts
│       ├── messages.repository.ts
│       ├── messages.validation.ts
│       └── messages.routes.ts
├── middlewares/
│   ├── auth.middleware.ts   # Middleware de autenticação JWT
│   └── error.middleware.ts  # Middleware de tratamento de erros
├── app.ts                   # Configuração do Express
├── routes.ts                # Rotas centralizadas
└── server.ts                # Ponto de entrada

prisma/
├── schema.prisma            # Schema do banco de dados
└── seed.ts                  # Seed para popular o banco
```

## ⚙️ Instalação e Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/projeto_medicina?schema=public"

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_12345
JWT_EXPIRES_IN=7d
```

### 3. Configurar banco de dados PostgreSQL

Certifique-se de que o PostgreSQL está rodando e ajuste a `DATABASE_URL` no arquivo `.env`.

### 4. Executar migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. Popular banco de dados (seed)

```bash
npm run prisma:seed
```

Este comando irá criar:
- ✅ Usuário **Aymee** com senha **Braga**
- ✅ 50 alunos fictícios brasileiros

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000/api`

## 🔐 Autenticação

### Credenciais padrão

- **Username:** `Aymee`
- **Senha:** `Braga`

### Login

**POST** `/api/auth/login`

**Body:**
```json
{
  "username": "Aymee",
  "password": "Braga"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "Aymee",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Rotas protegidas

Todas as rotas (exceto `/auth/login`) exigem autenticação JWT.

**Header obrigatório:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📚 Endpoints

### 🏥 Health Check

**GET** `/api/health`

Verifica se a API está funcionando.

### 👨‍🎓 Students (Alunos)

#### Listar alunos

**GET** `/api/students`

**Query Params:**
- `search` (opcional) - Filtrar por nome (case insensitive)
- `page` (opcional, padrão: 1) - Número da página
- `limit` (opcional, padrão: 10) - Itens por página

**Exemplo:**
```
GET /api/students?search=ana&page=1&limit=10
```

**Resposta:**
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "Ana Clara Silva",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### 💬 Messages (Mensagens)

#### Criar mensagem

**POST** `/api/messages`

**Body:**
```json
{
  "studentId": "uuid-do-aluno",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Mensagem de até 900 caracteres..."
}
```

**Validações:**
- ✅ `studentId` deve ser um UUID válido de um aluno existente
- ✅ `familyName` é obrigatório
- ✅ `relationship` é obrigatório
- ✅ `message` deve ter no máximo 900 caracteres

**Resposta:** `201 Created`

#### Listar mensagens

**GET** `/api/messages`

**Query Params:**
- `page` (opcional, padrão: 1)
- `limit` (opcional, padrão: 10)

**Resposta:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "familyName": "Silva",
      "relationship": "Mãe",
      "message": "Mensagem completa...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "student": {
        "id": "uuid",
        "name": "Ana Clara Silva"
      }
    }
  ],
  "pagination": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```

#### Buscar mensagem por ID

**GET** `/api/messages/:id`

**Resposta:**
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Mensagem completa...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "student": {
    "id": "uuid",
    "name": "Ana Clara Silva"
  }
}
```

#### Atualizar mensagem

**PUT** `/api/messages/:id`

**Body (todos opcionais):**
```json
{
  "familyName": "Silva Santos",
  "relationship": "Pai",
  "message": "Nova mensagem..."
}
```

**Resposta:** `200 OK`

#### Deletar mensagem

**DELETE** `/api/messages/:id`

**Resposta:**
```json
{
  "message": "Mensagem deletada com sucesso"
}
```

## 🛡️ Status Codes

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Erro de validação
- `401 Unauthorized` - Não autorizado (token inválido/ausente)
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo watch

# Build
npm run build            # Compila TypeScript para JavaScript

# Produção
npm start                # Inicia servidor em produção (após build)

# Prisma
npm run prisma:migrate   # Executa migrations
npm run prisma:seed      # Popula banco de dados
npm run prisma:studio    # Abre Prisma Studio (GUI para o banco)
```

## 🧪 Testando a API

### Usando cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Aymee","password":"Braga"}'

# 2. Listar alunos
curl http://localhost:3000/api/students \
  -H "Authorization: Bearer SEU_TOKEN"

# 3. Criar mensagem
curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "uuid-do-aluno",
    "familyName": "Silva",
    "relationship": "Mãe",
    "message": "Mensagem de teste"
  }'
```

### Usando ferramentas

- **Postman**
- **Insomnia**
- **Thunder Client** (extensão VS Code)

## 🗄️ Modelo do Banco de Dados

### User
```
id          String (UUID)
username    String (unique)
password    String (hash bcrypt)
createdAt   DateTime
updatedAt   DateTime
```

### Student
```
id          String (UUID)
name        String (indexed)
createdAt   DateTime
updatedAt   DateTime
```

### Message
```
id           String (UUID)
studentId    String (FK → Student)
familyName   String
relationship String
message      Text (max 900 chars)
createdAt    DateTime
updatedAt    DateTime
```

**Relacionamentos:**
- Um `Student` pode ter várias `Messages`
- Uma `Message` pertence a um `Student` (cascade on delete)

## 🔒 Segurança

- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado
- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT com expiração configurável
- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs

## 📝 Boas Práticas Implementadas

- ✅ Arquitetura em camadas (Controller → Service → Repository)
- ✅ Separação de responsabilidades
- ✅ Código limpo e tipado
- ✅ Tratamento de erros centralizado
- ✅ Validação robusta de dados
- ✅ Respostas padronizadas em JSON
- ✅ Comentários explicativos
- ✅ Paginação em listagens
- ✅ Graceful shutdown

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se livre para usar e modificar conforme necessário.

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ para o Projeto Medicina**
#   p r o j e t o - m e d i c i n a - a p i  
 