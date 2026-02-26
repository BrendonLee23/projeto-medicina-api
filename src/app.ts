import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { connectDatabase, disconnectDatabase } from './config/database';

// Carregar variáveis de ambiente
dotenv.config();

/**
 * Classe principal da aplicação
 */
class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configura middlewares da aplicação
   */
  private initializeMiddlewares(): void {
    // Segurança
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
      })
    );

    // Parse JSON
    this.app.use(express.json());

    // Parse URL encoded
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Configura rotas da aplicação
   */
  private initializeRoutes(): void {
    this.app.use('/api', routes);
  }

  /**
   * Configura tratamento de erros
   */
  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Inicia o servidor
   */
  public async listen(): Promise<void> {
    try {
      // Conecta ao banco de dados
      await connectDatabase();

      // Inicia o servidor (0.0.0.0 para aceitar conexões externas)
      const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
      
      this.app.listen(this.port, host, () => {
        console.log(`🚀 Servidor rodando na porta ${this.port}`);
        console.log(`📍 URL: http://${host}:${this.port}/api`);
        console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n⚠️  Encerrando servidor...');
        await disconnectDatabase();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.log('\n⚠️  Encerrando servidor...');
        await disconnectDatabase();
        process.exit(0);
      });
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error);
      process.exit(1);
    }
  }
}

export default App;
