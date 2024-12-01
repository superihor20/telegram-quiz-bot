import { QuestionType } from 'src/question/enum/question-type';
import { ImportedAnswer } from 'src/import/types/imported-data';

export interface CreateQuestion {
  question: string;
  explanation?: string;
  code?: string;
  type: QuestionType;
  answers: ImportedAnswer[];
}
