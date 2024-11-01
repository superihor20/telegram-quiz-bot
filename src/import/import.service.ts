import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { ImportedData } from 'src/types/imported-data';

@Injectable()
export class ImportService {
  constructor(private readonly questionService: QuestionService) {}

  async importFromJson(file: Express.Multer.File) {
    const fileData = file.buffer.toString('utf-8');
    const data: ImportedData = JSON.parse(fileData);

    for (const questionData of data.questions) {
      await this.questionService.save({
        question: questionData.question,
        explanation: questionData.explanation,
        answers: questionData.answers,
      });
    }

    console.log('Питання та відповіді успішно імпортовані!');
  }
}
