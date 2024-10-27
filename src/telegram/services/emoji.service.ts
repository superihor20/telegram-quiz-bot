import { Injectable } from '@nestjs/common';

@Injectable()
export class EmojiService {
  private readonly emojiMap = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    0: '0️⃣',
  } as const;

  convertNumberToEmojiString(num: number): string {
    return [...num.toString()].reduce(
      (acc, digit) => acc + this.emojiMap[digit],
      '',
    );
  }
}
