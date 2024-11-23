import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionChatDto } from './dto/question-chat.dto';
import { QuestionChat } from './entities/question-chat.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionChat)
    private readonly questionChatRepository: Repository<QuestionChat>,
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

  async update(id: number, data: QuestionChatDto) {
    const question = await this.findById(id);

    await this.questionChatRepository.save(
      this.questionChatRepository.create({
        ...data,
        question,
      }),
    );

    try {
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

  async findFirstNotPublished(chatId: bigint) {
    try {
      return await this.questionRepository
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
