import { Module } from '@nestjs/common';

import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  exports: [AnswerService],
  providers: [AnswerService],
})
export class AnswerModule {}
