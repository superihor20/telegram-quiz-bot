export type ImportedAnswer = {
  answer: string;
  isCorrect: boolean;
};

export type ImportedQuestion = {
  question: string;
  explanation: string;
  answers: ImportedAnswer[];
  code?: string;
};

export type ImportedData = {
  questions: ImportedQuestion[];
};
