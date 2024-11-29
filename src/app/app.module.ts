import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Answer } from 'src/answer/entities/answer.entity';
import { AppDataSource } from 'src/common/data-source/data-source';
import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { User } from 'src/user/entities/user.entity';
import { TelegramModule } from 'src/telegram/telegram.module';
import { AnswerModule } from 'src/answer/answer.module';
import { ResultModule } from 'src/result/result.module';
import { QuestionModule } from 'src/question/question.module';
import { ImportModule } from 'src/import/import.module';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { WeeklyWinnerModule } from 'src/weekly-winner/weekly-winner.module';
import { WeeklyWinner } from 'src/weekly-winner/entities/weekly-winner.entity';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    TypeOrmModule.forFeature([Question, Answer, User, Result, WeeklyWinner]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'fonts'),
    }),
    AnswerModule,
    ResultModule,
    TelegramModule,
    QuestionModule,
    ImportModule,
    UserModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
    WeeklyWinnerModule,
  ],
})
export class AppModule {}
