# 🚀 Guia de Deploy em Produção

Este guia mostra como fazer deploy da API em diversos ambientes de produção.

---

## 📦 Preparando para Produção

### 1. Build da Aplicação

```bash
npm run build
```

Isso irá compilar o TypeScript para JavaScript na pasta `dist/`.

### 2. Variáveis de Ambiente

Crie um arquivo `.env` de produção com:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://usuario:senha@host:5432/database?schema=public"
JWT_SECRET=gere_uma_chave_secreta_forte_e_aleatoria_aqui
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-dominio.com
```

⚠️ **IMPORTANTE:**
- Use uma `JWT_SECRET` forte e única para produção
- Configure `CORS_ORIGIN` para permitir apenas seu domínio
- Use conexão SSL para o PostgreSQL em produção

### 3. Gerar JWT_SECRET Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 🌐 Deploy em VPS (Ubuntu/Debian)

### 1. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Instalar PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Criar Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE projeto_medicina;
CREATE USER seu_usuario WITH ENCRYPTED PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE projeto_medicina TO seu_usuario;
\q
```

### 4. Clonar Repositório

```bash
git clone seu-repositorio.git
cd Backend
npm install --production
```

### 5. Configurar .env

```bash
nano .env
# Cole suas variáveis de ambiente
```

### 6. Executar Migrations

```bash
npx prisma migrate deploy
npm run prisma:seed
```

### 7. Iniciar com PM2

```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar aplicação
pm2 start dist/server.js --name "medicina-api"

# Configurar para iniciar no boot
pm2 startup
pm2 save

# Verificar status
pm2 status

# Ver logs
pm2 logs medicina-api
```

### 8. Configurar Nginx (Reverse Proxy)

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/medicina-api
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/medicina-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Configurar SSL com Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
sudo systemctl restart nginx
```

---

## ☁️ Deploy no Railway

### 1. Criar conta no Railway

Acesse [railway.app](https://railway.app)

### 2. Criar novo projeto

- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Conecte seu repositório

### 3. Adicionar PostgreSQL

- Clique em "New" → "Database" → "Add PostgreSQL"
- Railway criará automaticamente a `DATABASE_URL`

### 4. Configurar Variáveis de Ambiente

No painel do Railway, vá em "Variables" e adicione:

```
NODE_ENV=production
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
PORT=3000
```

### 5. Configurar Build Commands

No arquivo `railway.json` na raiz:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 6. Deploy

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

Railway fará deploy automaticamente!

---

## 📦 Deploy no Render

### 1. Criar conta no Render

Acesse [render.com](https://render.com)

### 2. Criar PostgreSQL Database

- Clique em "New" → "PostgreSQL"
- Escolha o plano Free
- Copie a `DATABASE_URL`

### 3. Criar Web Service

- Clique em "New" → "Web Service"
- Conecte seu repositório GitHub
- Configure:

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npx prisma migrate deploy && npm start
```

### 4. Adicionar Environment Variables

```
NODE_ENV=production
DATABASE_URL=cole_aqui_a_url_do_postgres
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
```

### 5. Deploy

Render fará deploy automaticamente quando você fizer push!

---

## 🐳 Deploy com Docker

### 1. Criar Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Copiar código
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

### 2. Criar docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: medicina
      POSTGRES_PASSWORD: senha123
      POSTGRES_DB: projeto_medicina
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://medicina:senha123@postgres:5432/projeto_medicina?schema=public
      JWT_SECRET: sua_chave_secreta_aqui
      JWT_EXPIRES_IN: 7d
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 3. Build e Run

```bash
docker-compose up -d
```

---

## ⚙️ Monitoramento em Produção

### Logs com PM2

```bash
pm2 logs medicina-api
pm2 logs medicina-api --lines 100
```

### Monitoramento de Performance

```bash
pm2 monit
```

### Verificar Memória

```bash
pm2 info medicina-api
```

### Restart Aplicação

```bash
pm2 restart medicina-api
```

### Stop/Delete

```bash
pm2 stop medicina-api
pm2 delete medicina-api
```

---

## 🔐 Segurança em Produção

### ✅ Checklist de Segurança

- [ ] Use HTTPS/SSL em produção
- [ ] Configure CORS_ORIGIN para seu domínio específico
- [ ] Use JWT_SECRET forte e único
- [ ] Configure rate limiting
- [ ] Use PostgreSQL com SSL
- [ ] Mantenha dependências atualizadas
- [ ] Configure logs adequados
- [ ] Use variáveis de ambiente seguras
- [ ] Configure firewall no servidor
- [ ] Implemente monitoramento

### Rate Limiting (Opcional)

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
});

app.use('/api', limiter);
```

---

## 🧪 Testar em Produção

```bash
# Health Check
curl https://seu-dominio.com/api/health

# Login
curl -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Aymee","password":"Braga"}'
```

---

## 📊 Backup do Banco de Dados

### Backup Manual

```bash
pg_dump -U usuario -h host -d projeto_medicina > backup.sql
```

### Restaurar Backup

```bash
psql -U usuario -h host -d projeto_medicina < backup.sql
```

### Backup Automático (Cron)

```bash
crontab -e
```

```cron
# Backup diário às 2h da manhã
0 2 * * * pg_dump -U usuario -h host -d projeto_medicina > /backups/db-$(date +\%Y\%m\%d).sql
```

---

## 🎯 Performance

### Configurar Connection Pool

Em `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Connection pool otimizado
  pool {
    timeout = 20
    maxSize = 10
  }
}
```

### Otimizar Queries

- Use `select` para buscar apenas campos necessários
- Implemente cache com Redis (opcional)
- Configure índices no banco de dados

---

## 📞 Suporte

Se encontrar problemas no deploy:

1. Verifique os logs: `pm2 logs` ou logs do Render/Railway
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique a conexão com o banco de dados
4. Confirme que as migrations foram executadas

---

**Bom deploy! 🚀**
