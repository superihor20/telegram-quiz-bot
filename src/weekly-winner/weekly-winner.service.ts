import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyWinner } from './entities/weekly-winner.entity';
import { UserService } from 'src/user/user.service';
import { AllWinners } from './dto/all-winners';
import { Chat } from 'src/telegram/entities/chat.entity';

@Injectable()
export class WeeklyWinnerService {
  constructor(
    @InjectRepository(WeeklyWinner)
    private readonly weeklyWinnerRepository: Repository<WeeklyWinner>,
    private readonly userService: UserService,
  ) {}

  async saveWeeklyWinner(userId: number, chat: Chat): Promise<void> {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        return;
      }

      const winner = new WeeklyWinner();
      winner.user = user;
      winner.chat = chat;

      await this.weeklyWinnerRepository.save(winner);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getAllWinners(chatId: bigint): Promise<AllWinners> {
    try {
      return await this.weeklyWinnerRepository
        .createQueryBuilder('weekly_winner')
        .select('weekly_winner.user_id', 'userId')
        .addSelect('COUNT(weekly_winner.user_id)', 'wins')
        .addSelect('user.name', 'name')
        .addSelect('user.username', 'username')
        .leftJoin('weekly_winner.user', 'user')
        .leftJoin('chat', 'chat', 'weekly_winner.chat_id = chat.id')
        .where('chat.chat_id = :chatId', { chatId })
        .groupBy('weekly_winner.user_id')
        .addGroupBy('user.name')
        .addGroupBy('user.username')
        .orderBy('wins', 'DESC')
        .getRawMany();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
