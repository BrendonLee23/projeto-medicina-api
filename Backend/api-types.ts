/**
 * Tipos TypeScript para uso no Frontend
 * Copie este arquivo para o seu projeto frontend
 */

// ========================================
// AUTH
// ========================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
}

// ========================================
// USER
// ========================================

export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// STUDENT
// ========================================

export interface Student {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetStudentsQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetStudentsResponse {
  students: Student[];
  pagination: Pagination;
}

// ========================================
// MESSAGE
// ========================================

export interface Message {
  id: string;
  studentId: string;
  familyName: string;
  relationship: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
  };
}

export interface CreateMessageRequest {
  studentId: string;
  familyName: string;
  relationship: string;
  message: string;
}

export interface UpdateMessageRequest {
  familyName?: string;
  relationship?: string;
  message?: string;
}

export interface GetMessagesQuery {
  page?: number;
  limit?: number;
}

export interface GetMessagesResponse {
  messages: Message[];
  pagination: Pagination;
}

// ========================================
// COMMON
// ========================================

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface ErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface SuccessResponse {
  message: string;
}

// ========================================
// API HELPERS
// ========================================

/**
 * Classe auxiliar para fazer requisições à API
 * Exemplo de uso no React/Next.js
 */
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }

  // Auth
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.accessToken);
    return response;
  }

  logout() {
    this.clearToken();
  }

  // Students
  async getStudents(query?: GetStudentsQuery): Promise<GetStudentsResponse> {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString();
    return this.request<GetStudentsResponse>(
      `/students${queryString ? `?${queryString}` : ''}`
    );
  }

  // Messages
  async createMessage(data: CreateMessageRequest): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(query?: GetMessagesQuery): Promise<GetMessagesResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString();
    return this.request<GetMessagesResponse>(
      `/messages${queryString ? `?${queryString}` : ''}`
    );
  }

  async getMessageById(id: string): Promise<Message> {
    return this.request<Message>(`/messages/${id}`);
  }

  async updateMessage(
    id: string,
    data: UpdateMessageRequest
  ): Promise<Message> {
    return this.request<Message>(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(id: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/messages/${id}`, {
      method: 'DELETE',
    });
  }
}

// ========================================
// EXEMPLO DE USO NO REACT
// ========================================

/*
import { ApiClient } from './api-types';

// Criar instância do cliente
const api = new ApiClient('http://localhost:3000/api');

// Em um componente React
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.login({ username, password });
      console.log('Login bem-sucedido:', response.user);
      // Navegar para página principal
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    // JSX aqui
  );
}

function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await api.getStudents({ search: '', page: 1, limit: 10 });
      setStudents(data.students);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  return (
    // JSX aqui
  );
}
*/
