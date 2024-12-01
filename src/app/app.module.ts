import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppDataSource } from 'src/common/data-source/data-source';
import { TelegramModule } from 'src/telegram/telegram.module';
import { AnswerModule } from 'src/answer/answer.module';
import { ResultModule } from 'src/result/result.module';
import { QuestionModule } from 'src/question/question.module';
import { ImportModule } from 'src/import/import.module';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { WeeklyWinnerModule } from 'src/weekly-winner/weekly-winner.module';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
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
