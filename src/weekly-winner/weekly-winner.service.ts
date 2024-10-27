import { Injectable } from '@nestjs/common';
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

  async saveWeeklyWinner(
    userId: number,
    startOfWeek: Date,
    endOfWeek: Date,
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      return;
    }

    const winner = new WeeklyWinner();
    winner.user = user;
    winner.weekStartDate = startOfWeek;
    winner.weekEndDate = endOfWeek;

    await this.weeklyWinnerRepository.save(winner);
  }

  async getAllWinners(): Promise<AllWinners> {
    return this.weeklyWinnerRepository
      .createQueryBuilder('weeklyWinner')
      .select('weeklyWinner.user_id', 'userId')
      .addSelect('COUNT(weeklyWinner.user_id)', 'wins')
      .leftJoin('weeklyWinner.user', 'user')
      .addSelect('user.name', 'name')
      .addSelect('user.username', 'username')
      .groupBy('weeklyWinner.user_id')
      .addGroupBy('user.name')
      .addGroupBy('user.username')
      .orderBy('wins', 'DESC')
      .getRawMany();
  }
}
