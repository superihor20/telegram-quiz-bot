import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QuestionService } from 'src/question/question.service';
import { ResultService } from 'src/result/result.service';
import { ChatService } from 'src/telegram/services/chat.service';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { WeeklyWinnerService } from 'src/weekly-winner/weekly-winner.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly questionService: QuestionService,
    private readonly weeklyWinnerService: WeeklyWinnerService,
    private readonly resultService: ResultService,
    private readonly chatService: ChatService,
  ) {}

  @Cron('0 10,12,14,16,18,20 * * *') // 10:00, 12:00, 14:00, 16:00, 18:00, 20:00
  // @Cron('* * * * *')
  async sendQuiz() {
    const chats = await this.chatService.findAll();

    for (const chat of chats) {
      const questionData = await this.questionService.findFirstNotPublished(
        chat.chatId,
      );

      if (!questionData) {
        continue;
      }
      this.telegramService.sendQuiz(
        chat.chatId,
        questionData.id,
        questionData.question,
        questionData.answers.map((answer) => answer.answer),
        questionData.answers.findIndex((answer) => answer.isCorrect),
        questionData.explanation,
        questionData.code,
      );
    }
  }

  @Cron('58 23 * * 4') // 23:58 on Thursday
  async saveWeeklyWinner() {
    const chats = await this.chatService.findAll();

    for (const chat of chats) {
      await this.handleWinnersByChat(chat.chatId);
    }
  }

  async handleWinnersByChat(chatId: bigint) {
    const winners =
      await this.resultService.getUsersWithMaxCorrectAnswers(chatId);
    const chat = await this.chatService.find(chatId);

    if (!winners.length) {
      return;
    }

    for (const winner of winners) {
      await this.weeklyWinnerService.saveWeeklyWinner(winner.id, chat);
    }
  }
}
