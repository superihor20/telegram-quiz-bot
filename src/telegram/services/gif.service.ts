import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import {
  bestGif,
  cringeGif,
  noBadWordsGif,
  pressFGifs,
} from 'src/common/constants/gif';
import { getRandomNumber } from 'src/common/utils/get-random-number';
import { Context } from 'telegraf';

@Injectable()
export class GifService {
  private readonly gifs = {
    best: bestGif,
    cringe: cringeGif,
    pressF: pressFGifs,
    noBadWords: noBadWordsGif,
  } as const;

  getRandomGif(category: keyof typeof this.gifs): string {
    const gifs = this.gifs[category];

    return gifs[getRandomNumber(gifs.length - 1)];
  }

  async replyWithRandomGif(ctx: Context, category: keyof typeof this.gifs) {
    const gifPath = this.getRandomGif(category);
    await ctx.replyWithAnimation({
      source: resolve(__dirname, '..', '..', '..', 'assets', gifPath),
    });
  }
}
