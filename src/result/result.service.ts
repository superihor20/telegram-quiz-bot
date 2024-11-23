import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Result } from './entities/result.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { getWeekRange } from 'src/common/utils/get-week-range';
import { MaxCorrectAnswerUser } from './dto/max-correct-answer-user';
import { MinCorrectAnswerUser } from './dto/min-correct-answer-user';
import {
  LeaderboardUser,
  LowerCaseLeaderboardUser,
} from './dto/leaderboard-user';
import { Chat } from 'src/telegram/entities/chat.entity';
import { ResultRepository } from './result.respository';

@Injectable()
export class ResultService {
  constructor(private readonly resultRepository: ResultRepository) {}

  async saveResult(
    user: User,
    question: Question,
    answer: Answer,
    isCorrect: boolean,
    chat: Chat,
  ): Promise<Result> {
    try {
      const result = this.resultRepository.create({
        user,
        question,
        answer,
        is_correct: isCorrect,
        chat,
      });
      return await this.resultRepository.save(result);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save result');
    }
  }

  async getLeaderboard(chatId: bigint): Promise<LeaderboardUser[]> {
    try {
      const { startOfWeek, endOfWeek } = getWeekRange();
      const results: LowerCaseLeaderboardUser[] =
        await this.resultRepository.getUserResultsWithStats(
          chatId,
          startOfWeek,
          endOfWeek,
        );

      return results.map((result) => ({
        ...result,
        correctAnswers: result.correctanswers,
        incorrectAnswers: result.incorrectanswers,
      })) as LeaderboardUser[];
    } catch (error) {
      return [];
    }
  }

  async getUsersWithMaxCorrectAnswers(
    chatId: bigint,
  ): Promise<MaxCorrectAnswerUser[]> {
    try {
      const { startOfWeek, endOfWeek } = getWeekRange();
      const result: MaxCorrectAnswerUser[] = (
        await this.resultRepository.getUsersWithMostCorrectAnswers(
          chatId,
          startOfWeek,
          endOfWeek,
        )
      ).map((user) => ({
        ...user,
        id: user.user_id,
        correctAnswers: user.correctanswers,
      }));

      return result;
    } catch (error) {
      return [];
    }
  }

  async getUsersWithMinCorrectAnswers(
    chatId: bigint,
  ): Promise<MinCorrectAnswerUser[]> {
    try {
      const { startOfWeek, endOfWeek } = getWeekRange();
      const result: MinCorrectAnswerUser[] = (
        await this.resultRepository.getUsersWithLeastCorrectAnswers(
          chatId,
          startOfWeek,
          endOfWeek,
        )
      ).map((user) => ({
        ...user,
        id: user.user_id,
        incorrectAnswers: user.incorrectanswers,
      }));

      return result;
    } catch (error) {
      return [];
    }
  }
}
