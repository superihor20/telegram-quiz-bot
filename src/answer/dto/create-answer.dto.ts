export type CreateAnswerDto = {
  answer: string;
  isCorrect: boolean;
  question?: { id: number };
};
