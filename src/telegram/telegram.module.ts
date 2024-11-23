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
import { EventService } from './services/event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatService } from './services/chat.service';

@Module({
  imports: [
    UserModule,
    QuestionModule,
    ResultModule,
    WeeklyWinnerModule,
    AppConfigModule,
    TypeOrmModule.forFeature([Chat]),
  ],
  exports: [
    TelegramService,
    TelegramUserService,
    GifService,
    EmojiService,
    CommandService,
    EventService,
    ChatService,
  ],
  providers: [
    TelegramService,
    TelegramUserService,
    GifService,
    EmojiService,
    CommandService,
    EventService,
    ChatService,
  ],
})
export class TelegramModule {}
