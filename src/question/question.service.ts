import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestion } from './interfaces/create-question';
import { QuestionChat as QuestionChatType } from './interfaces/question-chat';
import { QuestionChat } from './entities/question-chat.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionChat)
    private readonly questionChatRepository: Repository<QuestionChat>,
  ) {}

  async findById(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (question) {
      return question;
    }

    throw new NotFoundException('Question not found');
  }

  create(data: CreateQuestion): Question {
    return this.questionRepository.create(data);
  }

  async save(data: CreateQuestion): Promise<void> {
    if (!data.question || !data.answers) {
      throw new BadRequestException(
        'Invalid question data: question and answers are required',
      );
    }

    const question = this.create(data);

    await this.questionRepository.save(question);
  }

  async update(id: number, data: QuestionChatType): Promise<void> {
    const question = await this.findById(id);

    await this.questionChatRepository.save(
      this.questionChatRepository.create({
        ...data,
        question,
      }),
    );
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.questionRepository.delete(id);
  }

  async findAll(): Promise<{
    questions: Question[];
    count: number;
  }> {
    const [questions, count] = await this.questionRepository.findAndCount();

    return { questions, count };
  }

  async findFirstNotPublished(chatId: bigint): Promise<Question | null> {
    return this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.answers', 'a')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COALESCE(MAX(innerQ.id), 0)', 'maxId')
          .from('question', 'innerQ')
          .innerJoin('question_chat', 'qc', 'innerQ.id = qc.question_id')
          .innerJoin('chat', 'c', 'qc.chat_id = c.id')
          .where('c.chat_id = :chatId')
          .getQuery();
        return 'q.id > (' + subQuery + ')';
      })
      .setParameter('chatId', chatId)
      .orderBy('a.id', 'ASC')
      .getOne();
  }

  async findBy(
    where: FindOptionsWhere<Question>,
    relations?: FindOptionsRelations<Question>,
  ): Promise<Question | null> {
    return this.questionRepository.findOne({ where, relations });
  }
}
