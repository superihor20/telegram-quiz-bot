import { Module } from '@nestjs/common';

import { TelegramService } from './services/telegram.service';
import { UserModule } from 'src/user/user.module';
import { QuestionModule } from 'src/question/question.module';
import { ResultModule } from 'src/result/result.module';
import { WeeklyWinnerModule } from 'src/weekly-winner/weekly-winner.module';
import { TelegramUserService } from './services/telegram-user.service';
import { GifService } from './services/gif.service';
import { EmojiService } from './services/emoji.service';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [
    UserModule,
    QuestionModule,
    ResultModule,
    WeeklyWinnerModule,
    AppConfigModule,
  ],
  exports: [TelegramService, TelegramUserService, GifService, EmojiService],
  providers: [TelegramService, TelegramUserService, GifService, EmojiService],
})
export class TelegramModule {}
