# 🚀 Guia Rápido de Início

## ⚡ Setup em 5 Minutos

### 1️⃣ Clone e Instale

```bash
cd Backend
npm install
```

### 2️⃣ Configure o Banco de Dados

Crie um arquivo `.env` na raiz:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://usuario:senha@localhost:5432/projeto_medicina?schema=public"
JWT_SECRET=sua_chave_secreta_super_segura_aqui_12345
JWT_EXPIRES_IN=7d
```

### 3️⃣ Configure o PostgreSQL

**Opção A: PostgreSQL Local**
- Instale o PostgreSQL
- Crie um banco chamado `projeto_medicina`
- Ajuste a `DATABASE_URL` com suas credenciais

**Opção B: Docker**
```bash
docker run --name postgres-medicina -e POSTGRES_PASSWORD=senha -e POSTGRES_DB=projeto_medicina -p 5432:5432 -d postgres
```

Então use:
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/projeto_medicina?schema=public"
```

### 4️⃣ Execute as Migrations

```bash
npx prisma migrate dev --name init
```

### 5️⃣ Popule o Banco

```bash
npm run prisma:seed
```

✅ Isso criará:
- Usuário: **Aymee** / Senha: **Braga**
- 50 alunos fictícios

### 6️⃣ Inicie o Servidor

```bash
npm run dev
```

🎉 **Pronto!** API rodando em `http://localhost:3000/api`

---

## 🧪 Teste Rápido

### 1. Teste o Health Check

```bash
curl http://localhost:3000/api/health
```

### 2. Faça Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Aymee","password":"Braga"}'
```

Copie o `accessToken` da resposta.

### 3. Liste os Alunos

```bash
curl http://localhost:3000/api/students \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📂 Estrutura do Projeto

```
Backend/
├── prisma/
│   ├── schema.prisma        # 🗄️  Schema do banco
│   └── seed.ts              # 🌱 Seed de dados
│
├── src/
│   ├── config/
│   │   └── database.ts      # ⚙️  Configuração Prisma
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # 🔐 Autenticação JWT
│   │   └── error.middleware.ts   # ❌ Tratamento de erros
│   │
│   ├── modules/
│   │   ├── auth/            # 🔑 Módulo de autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── students/        # 👨‍🎓 Módulo de alunos
│   │   │   ├── students.controller.ts
│   │   │   ├── students.service.ts
│   │   │   ├── students.repository.ts
│   │   │   ├── students.validation.ts
│   │   │   └── students.routes.ts
│   │   │
│   │   └── messages/        # 💬 Módulo de mensagens
│   │       ├── messages.controller.ts
│   │       ├── messages.service.ts
│   │       ├── messages.repository.ts
│   │       ├── messages.validation.ts
│   │       └── messages.routes.ts
│   │
│   ├── app.ts               # 🏗️  Configuração Express
│   ├── routes.ts            # 🛣️  Rotas centralizadas
│   └── server.ts            # 🚀 Ponto de entrada
│
├── .env.example             # 📝 Exemplo de variáveis
├── .gitignore               # 🚫 Arquivos ignorados
├── package.json             # 📦 Dependências
├── tsconfig.json            # ⚙️  Configuração TypeScript
├── README.md                # 📖 Documentação completa
└── EXAMPLES.md              # 💡 Exemplos de uso
```

---

## 🎯 Endpoints Principais

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/api/auth/login` | ❌ Não | Login |
| `GET` | `/api/students` | ✅ Sim | Listar alunos |
| `POST` | `/api/messages` | ✅ Sim | Criar mensagem |
| `GET` | `/api/messages` | ✅ Sim | Listar mensagens |
| `GET` | `/api/messages/:id` | ✅ Sim | Buscar mensagem |
| `PUT` | `/api/messages/:id` | ✅ Sim | Atualizar mensagem |
| `DELETE` | `/api/messages/:id` | ✅ Sim | Deletar mensagem |

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Modo watch com hot reload

# Produção
npm run build           # Compila para JavaScript
npm start               # Roda versão compilada

# Prisma
npx prisma studio       # Interface visual do banco
npx prisma migrate dev  # Criar nova migration
npm run prisma:seed     # Popular banco de dados

# Verificar estrutura
npx prisma format       # Formatar schema.prisma
npx prisma validate     # Validar schema
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Error: P1001: Can't reach database server"

**Solução:** Verifique se o PostgreSQL está rodando e se a `DATABASE_URL` está correta.

```bash
# Verificar se PostgreSQL está rodando (Windows)
Get-Service -Name postgresql*

# Verificar se PostgreSQL está rodando (Linux/Mac)
sudo systemctl status postgresql
```

---

### ❌ Erro: "JWT_SECRET não configurado"

**Solução:** Certifique-se de ter criado o arquivo `.env` com a variável `JWT_SECRET`.

---

### ❌ Erro: "Credenciais inválidas"

**Solução:** Execute o seed novamente:

```bash
npm run prisma:seed
```

---

### ❌ Erro de compilação TypeScript

**Solução:** Limpe o cache e reinstale:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Próximos Passos

1. ✅ Configure o `.env`
2. ✅ Execute migrations e seed
3. ✅ Teste os endpoints
4. ✅ Integre com o frontend
5. ✅ Configure CORS para seu domínio
6. ✅ Configure variáveis de produção

---

## 🔗 Links Úteis

- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Express](https://expressjs.com/)
- [Documentação Zod](https://zod.dev/)
- [JWT.io](https://jwt.io/)

---

## 💡 Dicas de Desenvolvimento

✅ Use o **Prisma Studio** para visualizar dados: `npx prisma studio`

✅ Teste endpoints com **Thunder Client** (extensão VS Code)

✅ Configure **ESLint** e **Prettier** para código limpo

✅ Use **Git** para versionamento

✅ Documente suas alterações

---

**Bom desenvolvimento! 🚀**
