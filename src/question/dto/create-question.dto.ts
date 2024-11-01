import { ImportedAnswer } from 'src/types/imported-data';

export type CreateQuestionDto = {
  question: string;
  explanation?: string;
  code?: string;
  answers: ImportedAnswer[];
  isPublished?: boolean;
};
