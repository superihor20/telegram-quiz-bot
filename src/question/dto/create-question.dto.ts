import { Answer } from 'src/answer/entities/answer.entity';

export type CreateQuestionDto = {
  question: string;
  explanation?: string;
  code?: string;
  answers: Answer[];
  isPublished?: boolean;
};
