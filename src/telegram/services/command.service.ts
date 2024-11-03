import { Injectable } from '@nestjs/common';
import { TelegramUserService } from './telegram-user.service';
import { Context } from 'telegraf';
import { ResultService } from 'src/result/result.service';
import { EmojiService } from './emoji.service';
import { WeeklyWinnerService } from 'src/weekly-winner/weekly-winner.service';
import { GifService } from './gif.service';
import { formatAnswerText } from 'src/utils/format-answer-text';
import { CommandHandler } from 'src/decorators/command-handler.decorator';
import { LeaderboardUser } from 'src/result/dto/leaderboard-user';
import { MaxCorrectAnswerUser } from 'src/result/dto/max-correct-answer-user';
import { MinCorrectAnswerUser } from 'src/result/dto/min-correct-answer-user';

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

  @CommandHandler('f')
  async handleCommandF(ctx: Context) {
    this.gifService.replyWithRandomGif(ctx, 'pressF');
  }

  @CommandHandler('leaderboard')
  async handleCommandLeaderboard(ctx: Context) {
    const leaderboard = await this.resultService.getLeaderboard();

    await this.replyIfEmpty(
      ctx,
      leaderboard,
      'Таблиця результатів поки що порожня',
      async (data) => {
        await ctx.reply(
          this.generateListMessage(
            'Таблиця результатів:',
            data,
            this.formatLeaderboardUser,
          ),
        );
      },
    );
  }

  @CommandHandler('goat')
  async handleCommandGoat(ctx: Context) {
    const best = await this.resultService.getUsersWithMaxCorrectAnswers();

    await this.replyIfEmpty(
      ctx,
      best,
      'Найкращих поки що немає',
      async (data) => {
        await ctx.reply(
          this.generateListMessage('Найкращі:', data, this.formatSimpleUser),
        );
        await this.gifService.replyWithRandomGif(ctx, 'best');
      },
    );
  }

  @CommandHandler('cringe')
  async handleCommandCringe(ctx: Context) {
    const cringe = await this.resultService.getUsersWithMinCorrectAnswers();

    await this.replyIfEmpty(
      ctx,
      cringe,
      'Крінжів поки що немає',
      async (data) => {
        ctx.reply(
          this.generateListMessage('Крінжі:', data, this.formatSimpleUser),
        );
        this.gifService.replyWithRandomGif(ctx, 'cringe');
      },
    );
  }

  @CommandHandler('mvp')
  async handleCommandMvp(ctx: Context) {
    const winner = await this.weeklyWinnerService.getAllWinners();

    await this.replyIfEmpty(
      ctx,
      winner,
      'Тижневих MVP поки що немає',
      async (data) => {
        await ctx.reply(
          this.generateListMessage('Тижневі MVP:', data, this.formatWinnerUser),
        );
      },
    );
  }

  private async replyIfEmpty<T>(
    ctx: Context,
    data: T[],
    emptyMessage: string,
    callback: (data: T[]) => Promise<void>,
  ) {
    if (!data.length) {
      ctx.reply(emptyMessage);

      return;
    }

    await callback(data);
  }

  private generateListMessage<T>(
    title: string,
    items: T[],
    template: (item: T, index: number) => string,
  ): string {
    const formattedItems = items.map((item, index) => template(item, index));

    return `${title}\n${formattedItems.join('\n')}`;
  }

  private formatLeaderboardUser = (user: LeaderboardUser, index: number) => {
    return `${index + 1}. ${user.name} (@${user.username}) — ${formatAnswerText(user.correctAnswers)} та ${formatAnswerText(user.incorrectAnswers, true)} відповідей. Стрік з ${this.emojiService.convertNumberToEmojiString(user.streak)}`;
  };

  private formatSimpleUser = (
    user: MaxCorrectAnswerUser | MinCorrectAnswerUser,
  ) => {
    return `${user.name} (@${user.username})`;
  };

  formatWinnerUser = (user: any) => {
    return `${user.name} (@${user.username}): Перемог: ${user.wins}`;
  };
}
