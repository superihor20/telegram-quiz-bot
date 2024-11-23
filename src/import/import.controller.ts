import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionType } from 'src/common/enum/question-type';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('upload/:difficulty')
  @UseInterceptors(
    FileInterceptor('json-with-questions', {
      limits: {
        fields: 0,
        fileSize: 1024 * 1024,
        files: 1,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('difficulty') difficulty: 'easy' | 'hard',
  ) {
    const questionType =
      difficulty.toLowerCase() === 'easy'
        ? QuestionType.EASY
        : QuestionType.HARD;

    await this.importService.importFromJson(file, questionType);
  }

  @Get('/test')
  @HttpCode(HttpStatus.OK)
  async test(): Promise<string> {
    return 'Тестовий метод успішно викликано!';
  }
}
