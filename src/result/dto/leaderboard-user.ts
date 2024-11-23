export type LeaderboardUser = {
  name: string;
  username: string;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
};

export type LowerCaseLeaderboardUser = {
  [K in keyof LeaderboardUser as Lowercase<K & string>]: LeaderboardUser[K];
};
