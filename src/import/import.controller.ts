import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async importData(): Promise<string> {
    await this.importService.importFromJson();

    return 'Дані успішно імпортовані!';
  }

  @Get('/test')
  @HttpCode(HttpStatus.OK)
  async test(): Promise<string> {
    return 'Тестовий метод успішно викликано!';
  }
}
