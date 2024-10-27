import { CreateQuestionDto } from './create-question.dto';

export type UpdateQuestionDto = Partial<CreateQuestionDto> & {
  pollId: string;
  messageId: number;
};
