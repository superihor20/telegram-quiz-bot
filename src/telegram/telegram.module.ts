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
import { CommandService } from './services/command.service';

@Module({
  imports: [
    UserModule,
    QuestionModule,
    ResultModule,
    WeeklyWinnerModule,
    AppConfigModule,
  ],
  exports: [
    TelegramService,
    TelegramUserService,
    GifService,
    EmojiService,
    CommandService,
  ],
  providers: [
    TelegramService,
    TelegramUserService,
    GifService,
    EmojiService,
    CommandService,
  ],
})
export class TelegramModule {}
