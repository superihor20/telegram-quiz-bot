import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('json-with-questions', {
      limits: {
        fields: 0,
        fileSize: 1024 * 1024,
        files: 1,
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    await this.importService.importFromJson(file);
  }

  @Get('/test')
  @HttpCode(HttpStatus.OK)
  async test(): Promise<string> {
    return 'Тестовий метод успішно викликано!';
  }
}
