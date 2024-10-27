import { Module } from '@nestjs/common';

import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  exports: [QuestionService],
  providers: [QuestionService],
})
export class QuestionModule {}
