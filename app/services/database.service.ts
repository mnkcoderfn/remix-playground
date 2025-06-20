import pgPromise from 'pg-promise';

export class DatabaseService {
  private db: pgPromise.IDatabase<any> | null = null;

  constructor() {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'remix_playground',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    };

    const pgp = pgPromise();
    this.db = pgp(config);
  }

  getConnection() {
    return this.db!;
  }

  async testConnection() {
    try {
      await this.db!.one('SELECT NOW()');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
} 