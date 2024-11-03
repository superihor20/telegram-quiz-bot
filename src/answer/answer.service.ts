import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async findById(id: number) {
    try {
      const answer = await this.answerRepository.findOne({ where: { id } });

      if (answer) {
        return answer;
      }

      throw new NotFoundException('Answer not found');
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  create(data: CreateAnswerDto) {
    try {
      return this.answerRepository.create(data);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async save(data: CreateAnswerDto) {
    try {
      const answer = this.answerRepository.create({
        answer: data.answer,
        isCorrect: data.isCorrect,
        ...(data.question?.id && { question: { id: data.question.id } }), // Spread only if `id` exists
      });

      this.answerRepository.save(answer);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async update(id: number, data: UpdateAnswerDto) {
    await this.findById(id);

    try {
      await this.answerRepository.update(id, data);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async delete(id: number) {
    await this.findById(id);

    try {
      await this.answerRepository.delete(id);
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  async findByQuestionId(questionId: number) {
    try {
      return this.answerRepository.find({
        where: { question: { id: questionId } },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll() {
    try {
      const [questions, count] = await this.answerRepository.findAndCount();

      return { questions, count };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
