import { Module } from '@nestjs/common';

import { ResultService } from './result.service';
import { Result } from './entities/result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultRepository } from './result.respository';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  exports: [ResultService],
  providers: [ResultService, ResultRepository],
})
export class ResultModule {}
