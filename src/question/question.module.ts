import { Module } from '@nestjs/common';

import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionChat } from './entities/question-chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionChat])],
  exports: [QuestionService],
  providers: [QuestionService],
})
export class QuestionModule {}
