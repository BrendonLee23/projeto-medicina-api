# 📖 Exemplos de Uso da API

## 1. Fluxo Completo de Uso

### Passo 1: Fazer Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "Aymee",
  "password": "Braga"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "Aymee",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

⚠️ **Importante:** Copie o `accessToken` para usar nas próximas requisições!

---

### Passo 2: Buscar Alunos

```bash
GET http://localhost:3000/api/students?search=ana&page=1&limit=10
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**
```json
{
  "students": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
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

⚠️ **Copie o `id` de um aluno para usar na próxima requisição!**

---

### Passo 3: Criar uma Mensagem

```bash
POST http://localhost:3000/api/messages
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "studentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Querida Ana, estou muito orgulhosa do seu progresso neste semestre. Continue se dedicando aos estudos. Com amor, mamãe."
}
```

**Resposta:**
```json
{
  "id": "msg-123-456-789",
  "studentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Querida Ana, estou muito orgulhosa...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "student": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Ana Clara Silva"
  }
}
```

---

### Passo 4: Listar Todas as Mensagens

```bash
GET http://localhost:3000/api/messages?page=1&limit=10
Authorization: Bearer SEU_TOKEN_AQUI
```

---

### Passo 5: Buscar uma Mensagem Específica

```bash
GET http://localhost:3000/api/messages/msg-123-456-789
Authorization: Bearer SEU_TOKEN_AQUI
```

---

### Passo 6: Atualizar uma Mensagem

```bash
PUT http://localhost:3000/api/messages/msg-123-456-789
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "message": "Querida Ana, estou muito orgulhosa do seu progresso! Continue assim. Com amor, mamãe."
}
```

---

### Passo 7: Deletar uma Mensagem

```bash
DELETE http://localhost:3000/api/messages/msg-123-456-789
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**
```json
{
  "message": "Mensagem deletada com sucesso"
}
```

---

## 2. Cenários de Erro

### 🔴CredenciaisInválidas

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "Aymee",
  "password": "SenhaErrada"
}
```

**Resposta:** `401 Unauthorized`
```json
{
  "error": "Credenciais inválidas"
}
```

---

### 🔴 Token Ausente

```bash
GET http://localhost:3000/api/students
# (sem header Authorization)
```

**Resposta:** `401 Unauthorized`
```json
{
  "error": "Token não fornecido"
}
```

---

### 🔴 Mensagem Muito Longa

```bash
POST http://localhost:3000/api/messages
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "studentId": "uuid",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Lorem ipsum dolor sit amet... (mais de 900 caracteres)"
}
```

**Resposta:** `400 Bad Request`
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

### 🔴 Aluno Não Encontrado

```bash
POST http://localhost:3000/api/messages
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "studentId": "uuid-invalido",
  "familyName": "Silva",
  "relationship": "Mãe",
  "message": "Mensagem"
}
```

**Resposta:** `404 Not Found`
```json
{
  "error": "Aluno não encontrado"
}
```

---

## 3. Usando com JavaScript/TypeScript (Frontend)

### Exemplo com Fetch API

```javascript
// 1. Login
async function login() {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Aymee',
      password: 'Braga',
    }),
  });

  const data = await response.json();
  
  // Salvar token no localStorage
  localStorage.setItem('token', data.accessToken);
  
  return data;
}

// 2. Buscar alunos
async function getStudents(search = '', page = 1) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `http://localhost:3000/api/students?search=${search}&page=${page}&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

// 3. Criar mensagem
async function createMessage(studentId, familyName, relationship, message) {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      studentId,
      familyName,
      relationship,
      message,
    }),
  });

  return response.json();
}

// 4. Listar mensagens
async function getMessages(page = 1) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `http://localhost:3000/api/messages?page=${page}&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

// 5. Atualizar mensagem
async function updateMessage(messageId, updates) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:3000/api/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  return response.json();
}

// 6. Deletar mensagem
async function deleteMessage(messageId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:3000/api/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
}

// Exemplo de uso
(async () => {
  try {
    // Login
    const loginData = await login();
    console.log('Login realizado:', loginData.user);

    // Buscar alunos
    const studentsData = await getStudents('Ana');
    console.log('Alunos encontrados:', studentsData.students);

    // Criar mensagem
    if (studentsData.students.length > 0) {
      const student = studentsData.students[0];
      const newMessage = await createMessage(
        student.id,
        'Silva',
        'Mãe',
        'Mensagem de teste'
      );
      console.log('Mensagem criada:', newMessage);
    }

    // Listar mensagens
    const messagesData = await getMessages(1);
    console.log('Mensagens:', messagesData.messages);
  } catch (error) {
    console.error('Erro:', error);
  }
})();
```

---

## 4. Usando Axios

```javascript
import axios from 'axios';

// Configurar instância do axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funções
export const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.accessToken);
    return data;
  },
};

export const studentsService = {
  getAll: async (search = '', page = 1, limit = 10) => {
    const { data } = await api.get('/students', {
      params: { search, page, limit },
    });
    return data;
  },
};

export const messagesService = {
  create: async (messageData) => {
    const { data } = await api.post('/messages', messageData);
    return data;
  },
  
  getAll: async (page = 1, limit = 10) => {
    const { data } = await api.get('/messages', {
      params: { page, limit },
    });
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/messages/${id}`);
    return data;
  },
  
  update: async (id, updates) => {
    const { data } = await api.put(`/messages/${id}`, updates);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/messages/${id}`);
    return data;
  },
};
```

---

## 5. Testando com Postman

1. Crie uma nova Collection chamada "Projeto Medicina"
2. Adicione uma variável de ambiente `baseUrl` = `http://localhost:3000/api`
3. Adicione uma variável `token` que será preenchida automaticamente

### Pre-request Script para Login:

```javascript
// Nenhum script necessário
```

### Test Script para Login:

```javascript
// Salvar o token automaticamente
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set("token", jsonData.accessToken);
}
```

### Configurar Authorization nas outras requisições:

- Type: Bearer Token
- Token: `{{token}}`

---

## 📌 Dicas

✅ **Sempre verifique se o token está válido** (tokens expiram em 7 dias por padrão)

✅ **Use paginação** para não sobrecarregar a API

✅ **Valide os dados no frontend** antes de enviar para a API

✅ **Trate erros adequadamente** mostrando mensagens amigáveis ao usuário

✅ **Guarde o token de forma segura** (localStorage no browser, SecureStore no React Native)

---

**Happy Coding! 🚀**
