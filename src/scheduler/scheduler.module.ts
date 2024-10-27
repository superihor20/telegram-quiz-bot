import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { QuestionModule } from 'src/question/question.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { WeeklyWinnerModule } from 'src/weekly-winner/weekly-winner.module';
import { ResultModule } from 'src/result/result.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    QuestionModule,
    TelegramModule,
    WeeklyWinnerModule,
    ResultModule,
    UserModule,
  ],
  exports: [SchedulerService],
  providers: [SchedulerService],
})
export class SchedulerModule {}
