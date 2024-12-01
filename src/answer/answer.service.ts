import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswer } from './interfaces/create-answer';
import { UpdateAnswer } from './interfaces/update-answer';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findById(id: number): Promise<Answer> {
    const answer = await this.answerRepository.findOne({ where: { id } });

    if (answer) {
      return answer;
    }

    throw new NotFoundException('Answer not found');
  }

  create(data: CreateAnswer): Answer {
    return this.answerRepository.create(data);
  }

  async save(data: CreateAnswer): Promise<void> {
    if (data.question?.id) {
      const questionExists = await this.questionRepository.findOne({
        where: { id: data.question.id },
      });
      if (!questionExists) {
        throw new NotFoundException('Related question not found');
      }
    }

    const answer = this.answerRepository.create({
      answer: data.answer,
      isCorrect: data.isCorrect,
      ...(data.question?.id && { question: { id: data.question.id } }),
    });

    await this.answerRepository.save(answer);
  }

  async update(id: number, data: UpdateAnswer): Promise<void> {
    await this.findById(id);
    await this.answerRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.answerRepository.delete(id);
  }

  async findByQuestionId(questionId: number): Promise<Answer[]> {
    return this.answerRepository.find({
      where: { question: { id: questionId } },
    });
  }

  async findAll(): Promise<{ answers: Answer[]; count: number }> {
    const [answers, count] = await this.answerRepository.findAndCount();

    return { answers, count };
  }
}
