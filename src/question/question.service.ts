import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findById(id: number) {
    try {
      const question = await this.questionRepository.findOne({ where: { id } });

      if (question) {
        return question;
      }

      throw new NotFoundException('Question not found');
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  create(data: CreateQuestionDto) {
    try {
      return this.questionRepository.create(data);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async save(data: CreateQuestionDto) {
    try {
      const question = this.create(data);

      await this.questionRepository.save(question);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e?.message);
    }
  }

  async update(id: number, data: UpdateQuestionDto) {
    await this.findById(id);

    try {
      await this.questionRepository.update(id, data);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async delete(id: number) {
    await this.findById(id);
    try {
      await this.questionRepository.delete(id);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async findAll() {
    try {
      const [questions, count] = await this.questionRepository.findAndCount();

      return { questions, count };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findFirstNotPublished() {
    try {
      return this.questionRepository.findOne({
        where: { isPublished: false },
        relations: ['answers'],
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findBy(
    where: FindOptionsWhere<Question>,
    relations?: FindOptionsRelations<Question>,
  ) {
    try {
      return this.questionRepository.findOne({ where, relations });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
