import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { User } from 'src/user/entities/user.entity';
import { WeeklyWinner } from 'src/weekly-winner/entities/weekly-winner.entity';
import { config } from 'dotenv';
import { QuestionChat } from 'src/question/entities/question-chat.entity';
import { Chat } from 'src/telegram/entities/chat.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  username: process.env.POSTGRES_USER || 'default_user',
  password: process.env.POSTGRES_PASSWORD || 'default_password',
  database: process.env.POSTGRES_DB || 'default_db',
  entities: [Question, Answer, User, Result, WeeklyWinner, QuestionChat, Chat],
  migrations: ['dist/migrations/*.{t,j}s'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
});
