import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import {
  bestGif,
  cringeGif,
  noBadWordsGif,
  pressFGifs,
} from 'src/constants/gif';
import { getRandomNumber } from 'src/utils/get-random-number';
import { Context } from 'telegraf';

@Injectable()
export class GifService {
  private readonly gifs = {
    best: bestGif,
    cringe: cringeGif,
    pressF: pressFGifs,
    noBadWords: noBadWordsGif,
  };

  getRandomGif(category: keyof typeof this.gifs): string {
    const gifs = this.gifs[category];

    return gifs[getRandomNumber(gifs.length - 1)];
  }

  async replyWithAnimation(ctx: Context, fileName: string) {
    const filePath = resolve(__dirname, '..', '..', '..', 'assets', fileName);
    await ctx.replyWithAnimation({ source: filePath });
  }
}
