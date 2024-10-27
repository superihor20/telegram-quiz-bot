import { Module } from '@nestjs/common';

import { ImportService } from './import.service';
import { QuestionModule } from 'src/question/question.module';
import { ImportController } from './import.controller';

@Module({
  imports: [QuestionModule],
  exports: [ImportService],
  providers: [ImportService],
  controllers: [ImportController],
})
export class ImportModule {}
