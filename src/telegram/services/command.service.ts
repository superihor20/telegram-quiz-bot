import { Injectable } from '@nestjs/common';
import { TelegramUserService } from './telegram-user.service';
import { Context } from 'telegraf';
import { ResultService } from 'src/result/result.service';
import { EmojiService } from './emoji.service';
import { WeeklyWinnerService } from 'src/weekly-winner/weekly-winner.service';
import { GifService } from './gif.service';
import { formatAnswerText } from 'src/utils/format-answer-text';
import { CommandHandler } from 'src/decorators/command-handler.decorator';

@Injectable()
export class CommandService {
  constructor(
    private readonly telegramUserService: TelegramUserService,
    private readonly resultService: ResultService,
    private readonly emojiService: EmojiService,
    private readonly weeklyWinnerService: WeeklyWinnerService,
    private readonly gifService: GifService,
  ) {}

  @CommandHandler('start')
  async handleCommandStart(ctx: Context) {
    const user = await this.telegramUserService.findOrCreateUser(ctx);

    ctx.reply(`Ласкаво просимо, ${user.name}!`);
  }

  @CommandHandler('leaderboard')
  async handleCommandLeaderboard(ctx: Context) {
    const leaderboard = await this.resultService.getLeaderboard();

    if (!leaderboard.length) {
      ctx.reply('Таблиця результатів поки що порожня');

      return;
    }

    let message = 'Таблиця результатів:\n';
    leaderboard.forEach((user, index) => {
      message += `${index + 1}. ${user.name} (@${user.username}) — ${formatAnswerText(user.correctAnswers)} та ${formatAnswerText(user.incorrectAnswers, true)} відповідей. Стрік з ${this.emojiService.convertNumberToEmojiString(user.streak)}\n`;
    });

    ctx.reply(message);
  }

  @CommandHandler('goat')
  async handleCommandGoat(ctx: Context) {
    const best = await this.resultService.getUsersWithMaxCorrectAnswers();

    if (!best.length) {
      ctx.reply('Найкращих поки що немає');

      return;
    }

    let message = 'Найкращі:\n';
    best.forEach((user) => {
      message += `${user.name} (@${user.username})\n`;
    });

    ctx.reply(message);
    this.gifService.replyWithRandomGif(ctx, 'best');
  }

  @CommandHandler('cringe')
  async handleCommandCringe(ctx: Context) {
    const cringe = await this.resultService.getUsersWithMinCorrectAnswers();
    if (!cringe.length) {
      ctx.reply('Крінжів поки що немає');

      return;
    }

    let message = 'Крінжі:\n';
    cringe.forEach((user) => {
      message += `${user.name} (@${user.username})\n`;
    });

    ctx.reply(message);
    this.gifService.replyWithRandomGif(ctx, 'cringe');
  }

  @CommandHandler('f')
  async handleCommandF(ctx: Context) {
    this.gifService.replyWithRandomGif(ctx, 'pressF');
  }

  @CommandHandler('mvp')
  async handleCommandMvp(ctx: Context) {
    const winner = await this.weeklyWinnerService.getAllWinners();

    if (!winner.length) {
      ctx.reply('MVP поки що немає');

      return;
    }

    let message = 'Тижневі MVP!:\n';
    winner.forEach((winner) => {
      message += `${winner.name} (@${winner.username}): Перемог: ${winner.wins}\n`;
    });

    ctx.reply(message);
  }
}
