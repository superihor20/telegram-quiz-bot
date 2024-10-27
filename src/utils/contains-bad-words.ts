import { badWords } from 'src/constants/bad-words';

export const containsBadWords = (text: string): boolean => {
  const regex = new RegExp(`(^|\\s)(${badWords.join('|')})(\\s|$)`, 'i');

  return regex.test(text);
};
