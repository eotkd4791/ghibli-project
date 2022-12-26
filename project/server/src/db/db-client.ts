import { DataSource } from 'typeorm';
import User from '../entities/User';

export const createDB = async () => {
  try {
    const AppDataSource = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'ghibli_graphql',
      username: 'root',
      password: process.env.DB_PASSWORD,
      logging: process.env.NODE_ENV !== 'production',
      synchronize: true,
      entities: [User],
    });
    await AppDataSource.initialize();
    return AppDataSource;
  } catch (error) {
    console.error(error);
    return null;
  }
};