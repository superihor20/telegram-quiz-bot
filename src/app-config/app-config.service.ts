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

  get adminId(): string {
    const adminId = this.configService.get<string>('ADMIN_ID');

    if (!adminId) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
    }

    return adminId;
  }
}
