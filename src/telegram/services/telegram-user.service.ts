import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';

@Injectable()
export class TelegramUserService {
  constructor(private readonly userService: UserService) {}

  async findOrCreateUser(ctx: Context) {
    if (!ctx.from) {
      throw new Error('No context');
    }

    const telegramId = String(ctx.from.id);
    const name = ctx.from.first_name;
    const username = ctx.from.username;
    let user = await this.userService.findByTelegramId(telegramId);

    if (!user) {
      user = await this.userService.createUser(telegramId, name, username);
    }

    return user;
  }
}
