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

  async getLeaderboard(chatId: BigInt): Promise<LeaderboardUser[]> {
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
    chatId: BigInt,
  ): Promise<MaxCorrectAnswerUser[]> {
    try {
      const { startOfWeek, endOfWeek } = getWeekRange();

      const subQuery = this.resultRepository
        .createQueryBuilder('result')
        .select('COUNT(result.is_correct)', 'correctAnswers')
        .leftJoin('result.question', 'question')
        .leftJoin('question.questionChats', 'questionChat')
        .where('result.is_correct = :is_correct', { is_correct: true })
        .andWhere('questionChat.chatId = :chatId', { chatId })
        .andWhere('question.createdAt BETWEEN :startOfWeek AND :endOfWeek', {
          startOfWeek,
          endOfWeek,
        })
        .groupBy('result.user')
        .orderBy('correctAnswers', 'DESC')
        .limit(1);

      return await this.resultRepository
        .createQueryBuilder('result')
        .select('user.name', 'name')
        .addSelect('user.username', 'username')
        .addSelect('COUNT(result.is_correct)', 'correctAnswers')
        .addSelect('user.id', 'id')
        .leftJoin('result.user', 'user')
        .leftJoin('result.question', 'question')
        .leftJoin('question.questionChats', 'questionChat')
        .where('result.is_correct = :is_correct', { is_correct: true })
        .andWhere('questionChat.chatId = :chatId', { chatId })
        .andWhere('question.createdAt BETWEEN :startOfWeek AND :endOfWeek', {
          startOfWeek,
          endOfWeek,
        })
        .groupBy('user.id')
        .having('COUNT(result.is_correct) = (' + subQuery.getQuery() + ')')
        .setParameters(subQuery.getParameters())
        .getRawMany();
    } catch (error) {
      return [];
    }
  }

  async getUsersWithMinCorrectAnswers(
    chatId: BigInt,
  ): Promise<MinCorrectAnswerUser[]> {
    try {
      const { startOfWeek, endOfWeek } = getWeekRange();

      const subQuery = this.resultRepository
        .createQueryBuilder('result')
        .select('COUNT(result.is_correct)', 'correctAnswers')
        .leftJoin('result.user', 'user')
        .leftJoin('result.question', 'question')
        .leftJoin('question.questionChats', 'questionChat')
        .where('result.is_correct = :is_correct', { is_correct: true })
        .andWhere('questionChat.chatId = :chatId', { chatId })
        .andWhere('question.createdAt BETWEEN :startOfWeek AND :endOfWeek', {
          startOfWeek,
          endOfWeek,
        })
        .groupBy('user.id')
        .orderBy('correctAnswers', 'ASC')
        .limit(1);

      return await this.resultRepository
        .createQueryBuilder('result')
        .select('user.name', 'name')
        .addSelect('user.username', 'username')
        .addSelect('COUNT(result.is_correct)', 'correctAnswers')
        .addSelect('user.id', 'id')
        .leftJoin('result.user', 'user')
        .leftJoin('result.question', 'question')
        .leftJoin('question.questionChats', 'questionChat')
        .where('result.is_correct = :is_correct', { is_correct: true })
        .andWhere('questionChat.chatId = :chatId', { chatId })
        .andWhere('question.createdAt BETWEEN :startOfWeek AND :endOfWeek', {
          startOfWeek,
          endOfWeek,
        })
        .groupBy('user.id')
        .having('COUNT(result.is_correct) = (' + subQuery.getQuery() + ')')
        .setParameters(subQuery.getParameters())
        .getRawMany();
    } catch (error) {
      return [];
    }
  }
}
