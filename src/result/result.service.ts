import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { getWeekRange } from 'src/utils/get-week-range';
import { MaxCorrectAnswerUser } from './dto/max-correct-answer-user';
import { MinCorrectAnswerUser } from './dto/min-correct-answer-user';
import { LeaderboardUser } from './dto/leaderboard-user';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  async saveResult(
    user: User,
    question: Question,
    answer: Answer,
    isCorrect: boolean,
  ): Promise<Result> {
    const result = this.resultRepository.create({
      user,
      question,
      answer,
      is_correct: isCorrect,
    });

    return this.resultRepository.save(result);
  }

  async getLeaderboard(): Promise<LeaderboardUser[]> {
    const { startOfWeek, endOfWeek } = getWeekRange();

    return this.resultRepository
      .createQueryBuilder('result')
      .select('user.name', 'name')
      .addSelect('user.username', 'username')
      .addSelect('user.streak', 'streak')
      .addSelect(
        'COUNT(CASE WHEN result.is_correct = true THEN 1 END)',
        'correctAnswers',
      )
      .addSelect(
        'COUNT(CASE WHEN result.is_correct = false THEN 1 END)',
        'incorrectAnswers',
      )
      .leftJoin('result.user', 'user')
      .leftJoin('result.question', 'question')
      .andWhere('question.lastUpdated BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .groupBy('user.id')
      .orderBy('correctAnswers', 'DESC')
      .getRawMany();
  }

  async getUsersWithMaxCorrectAnswers(): Promise<MaxCorrectAnswerUser[]> {
    const { startOfWeek, endOfWeek } = getWeekRange();

    const maxCorrectAnswers = await this.resultRepository
      .createQueryBuilder('result')
      .select('COUNT(result.is_correct)', 'correctAnswers')
      .leftJoin('result.user', 'user')
      .where('result.is_correct = :is_correct', { is_correct: true })
      .leftJoin('result.question', 'question')
      .andWhere('question.lastUpdated BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .groupBy('user.id')
      .orderBy('correctAnswers', 'DESC')
      .limit(1)
      .getRawOne();

    if (!maxCorrectAnswers) return [];

    return this.resultRepository
      .createQueryBuilder('result')
      .select('user.name', 'name')
      .addSelect('user.username', 'username')
      .addSelect('COUNT(result.is_correct)', 'correctAnswers')
      .addSelect('user.id', 'id')
      .leftJoin('result.user', 'user')
      .where('result.is_correct = :is_correct', { is_correct: true })
      .leftJoin('result.question', 'question')
      .andWhere('question.lastUpdated BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .groupBy('user.id')
      .having('COUNT(result.is_correct) = :maxCorrect', {
        maxCorrect: maxCorrectAnswers.correctAnswers,
      })
      .getRawMany();
  }

  async getUsersWithMinCorrectAnswers(): Promise<MinCorrectAnswerUser[]> {
    const { startOfWeek, endOfWeek } = getWeekRange();

    const minCorrectAnswers = await this.resultRepository
      .createQueryBuilder('result')
      .select('COUNT(result.is_correct)', 'correctAnswers')
      .leftJoin('result.user', 'user')
      .where('result.is_correct = :is_correct', { is_correct: true })
      .leftJoin('result.question', 'question')
      .andWhere('question.lastUpdated BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .groupBy('user.id')
      .orderBy('correctAnswers', 'ASC')
      .limit(1)
      .getRawOne();

    if (!minCorrectAnswers) return [];

    return this.resultRepository
      .createQueryBuilder('result')
      .select('user.name', 'name')
      .addSelect('user.username', 'username')
      .addSelect('COUNT(result.is_correct)', 'correctAnswers')
      .leftJoin('result.user', 'user')
      .where('result.is_correct = :is_correct', { is_correct: true })
      .leftJoin('result.question', 'question')
      .andWhere('question.lastUpdated BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .groupBy('user.id')
      .having('COUNT(result.is_correct) = :minCorrect', {
        minCorrect: minCorrectAnswers.correctAnswers,
      })
      .getRawMany();
  }
}
