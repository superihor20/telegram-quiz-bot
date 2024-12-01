import { QuestionType } from 'src/common/enum/question-type';
import { ImportedAnswer } from 'src/import/types/imported-data';

export type CreateQuestionDto = {
  question: string;
  explanation?: string;
  code?: string;
  type: QuestionType;
  answers: ImportedAnswer[];
};
