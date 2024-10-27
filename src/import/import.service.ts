import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class ImportService {
  constructor(private readonly questionService: QuestionService) {}

  async importFromJson() {
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      'data',
      'questions.json',
    );

    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    for (const questionData of data.questions) {
      await this.questionService.save({
        question: questionData.question,
        explanation: questionData.explanation,
        answers: questionData.answers.map((answerData) => ({
          answer: answerData.answer,
          isCorrect: answerData.isCorrect,
        })),
      });
    }

    console.log('Питання та відповіді успішно імпортовані!');
  }
}
