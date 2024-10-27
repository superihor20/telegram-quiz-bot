import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get telegramBotToken(): string {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
    }

    return token;
  }

  get telegramChatId(): string {
    const telegramChatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    if (!telegramChatId) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
    }

    return telegramChatId;
  }
}
