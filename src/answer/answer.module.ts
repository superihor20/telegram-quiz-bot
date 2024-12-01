import { Module } from '@nestjs/common';

import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question])],
  exports: [AnswerService],
  providers: [AnswerService],
})
export class AnswerModule {}
