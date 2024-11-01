import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import {
  bestGif,
  cringeGif,
  noBadWordsGif,
  pressFGifs,
} from 'src/constants/gif';
import { QuestionService } from 'src/question/question.service';
import { ResultService } from 'src/result/result.service';
import { WeeklyWinnerService } from 'src/weekly-winner/weekly-winner.service';
import { TelegramUserService } from './telegram-user.service';
import { containsF } from 'src/utils/contains-f';
import { containsBadWords } from 'src/utils/contains-bad-words';
import { getRandomNumber } from 'src/utils/get-random-number';
import { UserService } from 'src/user/user.service';
import { EmojiService } from './emoji.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { createCanvas } from 'canvas';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(
    private readonly questionService: QuestionService,
    private readonly resultService: ResultService,
    private readonly weeklyWinnerService: WeeklyWinnerService,
    private readonly telegramUserService: TelegramUserService,
    private readonly userService: UserService,
    private readonly emojiService: EmojiService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.bot = new Telegraf(this.appConfigService.telegramBotToken);

    this.bot.use((ctx, next) => {
      if (ctx.chat && ctx.chat.type === 'private') {
        return;
      }

      return next();
    });

    this.bot.command('start', async (ctx) => {
      const user = await this.telegramUserService.findOrCreateUser(ctx);

      ctx.reply(`Ласкаво просимо, ${user.name}!`);
    });

    this.bot.command('leaderboard', async (ctx) => {
      const leaderboard = await this.resultService.getLeaderboard();

      if (!leaderboard.length) {
        ctx.reply('Таблиця результатів поки що порожня');

        return;
      }

      let message = 'Таблиця результатів:\n';
      leaderboard.forEach((user, index) => {
        message += `${index + 1}. ${user.name} (@${user.username}) — ${this.getCorrectAnswerText(user.correctAnswers)} та ${this.getCorrectAnswerText(user.incorrectAnswers, true)} відповідей. Стрік з ${this.emojiService.convertNumberToEmojiString(user.streak)}\n`;
      });

      ctx.reply(message);
    });

    this.bot.command('goat', async (ctx) => {
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
      this.replyWithAnimation(
        ctx,
        bestGif[getRandomNumber(bestGif.length - 1)],
      );
    });

    this.bot.command('cringe', async (ctx) => {
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
      this.replyWithAnimation(
        ctx,
        cringeGif[getRandomNumber(cringeGif.length - 1)],
      );
    });

    this.bot.command('f', async (ctx) => {
      this.replyWithAnimation(
        ctx,
        pressFGifs[getRandomNumber(pressFGifs.length - 1)],
      );
    });

    this.bot.command('mvp', async (ctx) => {
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
    });

    this.bot.on('poll_answer', async (ctx) => {
      const userAnswerIndex = ctx.update.poll_answer.option_ids[0];
      const user = await this.telegramUserService.findOrCreateUser(ctx);

      if (user.id === 11) {
        return;
      }

      const question = await this.questionService.findBy(
        {
          pollId: ctx.update.poll_answer.poll_id,
        },
        { answers: true },
      );
      const answer = question?.answers.find(
        (_, index) => index === userAnswerIndex,
      );

      if (question && answer) {
        await this.resultService.saveResult(
          user,
          question,
          answer,
          answer?.isCorrect,
        );

        if (answer.isCorrect) {
          user.streak += 1;
        } else {
          user.streak = 0;
        }

        await this.userService.update(user);

        return;
      }

      ctx.reply('Твій голос не зарахований :(');
    });

    this.bot.on('text', async (ctx) => {
      if (containsBadWords(ctx.update.message.text)) {
        this.replyWithAnimation(ctx, noBadWordsGif[0]);

        return;
      }

      if (containsF(ctx.update.message.text)) {
        this.replyWithAnimation(
          ctx,
          pressFGifs[getRandomNumber(pressFGifs.length - 1)],
        );

        return;
      }
    });

    this.bot.launch();
  }

  async replyWithAnimation(ctx: Context, fileName: string) {
    const filePath = resolve(__dirname, '..', '..', '..', 'assets', fileName);
    ctx.replyWithAnimation({ source: filePath });
  }

  async sendQuiz(
    questionId: number,
    question: string,
    answers: string[],
    correctAnswer: number,
    explanation: string,
    code: string,
  ) {
    const image = await this.createImageWithText(
      code ? `${question}\n${code}` : `${question}`,
    );
    await this.bot.telegram.sendPhoto(this.appConfigService.telegramChatId, {
      source: image,
    });

    const quiz = await this.bot.telegram.sendQuiz(
      this.appConfigService.telegramChatId,
      'Оберіть правильну відповідь:',
      answers,
      {
        explanation: explanation,
        is_anonymous: false,
        correct_option_id: correctAnswer,
      },
    );

    await this.questionService.update(questionId, {
      pollId: quiz.poll.id,
      messageId: quiz.message_id,
      isPublished: true,
    });

    await this.bot.telegram.pinChatMessage(
      this.appConfigService.telegramChatId,
      quiz.message_id,
    );
  }

  getCorrectAnswerText(count: number, falsy = false) {
    if (count % 10 === 1 && count % 100 !== 11) {
      return `${count} ${falsy ? 'не' : ''}правильна`;
    } else if (
      [2, 3, 4].includes(count % 10) &&
      ![12, 13, 14].includes(count % 100)
    ) {
      return `${count} ${falsy ? 'не' : ''}правильні`;
    } else {
      return `${count} ${falsy ? 'не' : ''}правильних`;
    }
  }

  async createImageWithText(text: string) {
    const width = 500;
    const height = 300;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    let fontSize = 30;
    context.font = `${fontSize}px Arial`;
    const lines = text.split('\n');

    while (
      lines.some((line) => context.measureText(line).width > width - 40) &&
      fontSize > 10
    ) {
      fontSize -= 2;
      context.font = `${fontSize}px Arial`;
    }

    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#ffe400';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    const lineHeight = fontSize * 1.2;
    const textHeight = lineHeight * lines.length;
    const startY = (height - textHeight) / 2 + lineHeight / 2; // Center the text block vertically

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      context.fillText(line, 20, y);
    });

    return canvas.toBuffer();
  }
}
