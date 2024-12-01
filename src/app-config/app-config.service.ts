import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error';
import { EnvVariableKeys, EnvVariables } from './types/env-variables';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<EnvVariables>) {}

  getConfigValue(key: EnvVariableKeys): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new MissingEnvironmentVariableError(key);
    }

    return value;
  }

  get telegramBotToken(): string {
    return this.getConfigValue('TELEGRAM_BOT_TOKEN');
  }

  get adminId(): string {
    return this.getConfigValue('ADMIN_ID');
  }
}
