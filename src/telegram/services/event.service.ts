import { Injectable } from '@nestjs/common';
import { TelegramUserService } from './telegram-user.service';
import { Context, NarrowedContext } from 'telegraf';
import { ResultService } from 'src/result/result.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { QuestionService } from 'src/question/question.service';
import { UserService } from 'src/user/user.service';
import { containsBadWords } from 'src/utils/contains-bad-words';
import { containsF } from 'src/utils/contains-f';
import { GifService } from './gif.service';
import { EventHandler } from 'src/decorators/event-handler.decorator';

@Injectable()
export class EventService {
  constructor(
    private readonly telegramUserService: TelegramUserService,
    private readonly resultService: ResultService,
    private readonly appConfigService: AppConfigService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly gifService: GifService,
  ) {}

  @EventHandler('poll_answer')
  async handlePollAnswer(
    ctx: NarrowedContext<Context<Update>, Update.PollAnswerUpdate>,
  ) {
    const user = await this.telegramUserService.findOrCreateUser(ctx);

    if (user.telegram_id === this.appConfigService.adminId) {
      return;
    }

    const userAnswerIndex = ctx.update.poll_answer.option_ids[0];
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
  }

  @EventHandler('text')
  async handleText(
    ctx: NarrowedContext<
      Context<Update>,
      {
        message: Update.New & Update.NonChannel & Message.TextMessage;
        update_id: number;
      }
    >,
  ) {
    if (containsBadWords(ctx.update.message.text)) {
      this.gifService.replyWithRandomGif(ctx, 'noBadWords');

      return;
    }

    if (containsF(ctx.update.message.text)) {
      this.gifService.replyWithRandomGif(ctx, 'pressF');

      return;
    }
  }
}
