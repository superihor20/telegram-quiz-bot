import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyWinner } from './entities/weekly-winner.entity';
import { UserService } from 'src/user/user.service';
import { AllWinners } from './dto/all-winners';

@Injectable()
export class WeeklyWinnerService {
  constructor(
    @InjectRepository(WeeklyWinner)
    private readonly weeklyWinnerRepository: Repository<WeeklyWinner>,
    private readonly userService: UserService,
  ) {}

  async saveWeeklyWinner(userId: number): Promise<void> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        return;
      }

      const winner = new WeeklyWinner();
      winner.user = user;

      await this.weeklyWinnerRepository.save(winner);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getAllWinners(chatId: BigInt): Promise<AllWinners> {
    try {
      return await this.weeklyWinnerRepository
        .createQueryBuilder('weeklyWinner')
        .select('weeklyWinner.user', 'userId')
        .addSelect('COUNT(weeklyWinner.user)', 'wins')
        .leftJoin('weeklyWinner.user', 'user')
        .addSelect('user.name', 'name')
        .addSelect('user.username', 'username')
        .where('weeklyWinner.chatId = :chatId', { chatId }) // Filter by chatId if applicable
        .groupBy('weeklyWinner.user')
        .addGroupBy('user.name')
        .addGroupBy('user.username')
        .orderBy('wins', 'DESC')
        .getRawMany();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
