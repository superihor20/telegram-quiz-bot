import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { User } from 'src/user/entities/user.entity';
import { WeeklyWinner } from 'src/weekly-winner/entities/weekly-winner.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './data/quiz.db',
  entities: [Question, Answer, User, Result, WeeklyWinner],
  migrations: ['dist/migrations/*.{t,j}s'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
});
