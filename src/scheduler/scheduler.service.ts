import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QuestionService } from 'src/question/question.service';
import { ResultService } from 'src/result/result.service';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { getWeekRange } from 'src/utils/get-week-range';
import { WeeklyWinnerService } from 'src/weekly-winner/weekly-winner.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly questionService: QuestionService,
    private readonly weeklyWinnerService: WeeklyWinnerService,
    private readonly resultService: ResultService,
    private readonly userService: UserService,
  ) {}

  @Cron('0 10,14,18,20 * * *') // 10:00, 14:00, 18:00, 20:00
  async sendQuiz() {
    const questionData = await this.questionService.findFirstNotPublished();

    if (!questionData) {
      return;
    }

    this.telegramService.sendQuiz(
      questionData.id,
      questionData.question,
      questionData.answers.map((answer) => answer.answer),
      questionData.answers.findIndex((answer) => answer.isCorrect),
      questionData.explanation,
    );
  }

  @Cron('58 23 * * 4') // 23:58 on Thursday
  async saveWeeklyWinner() {
    const { startOfWeek, endOfWeek } = getWeekRange();
    const winners = await this.resultService.getUsersWithMaxCorrectAnswers();

    if (!winners.length) {
      return;
    }

    for (const winner of winners) {
      await this.weeklyWinnerService.saveWeeklyWinner(
        winner.id,
        startOfWeek,
        endOfWeek,
      );

      const user = (await this.userService.findById(winner.id)) as User;
      user.streak = 0;
      await this.userService.update(user);
    }
  }
}
