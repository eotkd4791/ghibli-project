import { DataSource } from 'typeorm';
import { CutReview } from '../entities/CutReview';
import User from '../entities/User';
import { CutVote } from '../entities/CutVote';

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
      entities: [User, CutVote, CutReview],
    });
    await AppDataSource.initialize();
    return AppDataSource;
  } catch (error) {
    console.error(error);
    return null;
  }
};
