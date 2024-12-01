export interface CreateAnswer {
  answer: string;
  isCorrect: boolean;
  question?: { id: number };
}
