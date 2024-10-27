import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyWinner } from './entities/weekly-winner.entity';
import { WeeklyWinnerService } from './weekly-winner.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklyWinner]), UserModule],
  exports: [WeeklyWinnerService],
  providers: [WeeklyWinnerService],
})
export class WeeklyWinnerModule {}
