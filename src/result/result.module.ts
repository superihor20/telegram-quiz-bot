import { Module } from '@nestjs/common';

import { ResultService } from './result.service';
import { Result } from './entities/result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  exports: [ResultService],
  providers: [ResultService],
})
export class ResultModule {}
