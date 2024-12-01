import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { ImportedData, ImportedQuestion } from 'src/import/types/imported-data';
import { QuestionType } from 'src/common/enum/question-type';

@Injectable()
export class ImportService {
  constructor(private readonly questionService: QuestionService) {}

  private async saveQuestion(
    questionData: ImportedQuestion,
    questionType: QuestionType,
  ) {
    return this.questionService.save({
      question: questionData.question,
      explanation: questionData.explanation,
      answers: questionData.answers,
      code: questionData.code,
      type: questionType,
    });
  }

  async importFromJson(file: Express.Multer.File, questionType: QuestionType) {
    try {
      const fileData = file.buffer.toString('utf-8');
      const data: ImportedData = JSON.parse(fileData);

      await Promise.all(
        data.questions.map(async (questionData, index) => {
          await this.saveQuestion(questionData, questionType);
          console.log(
            `Imported question ${index + 1} of ${data.questions.length}`,
          );
        }),
      );

      console.log('Questions and answers were successfully imported!');
    } catch (error) {
      console.error('Failed to import questions:', error);
      throw new Error('Import failed. Please check the file format and data.');
    }
  }
}
