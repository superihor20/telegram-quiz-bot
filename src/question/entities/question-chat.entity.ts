import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Chat } from 'src/telegram/entities/chat.entity';

@Entity()
export class QuestionChat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.questionChats, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  chat: Chat;

  @Column()
  messageId: number;

  @Column()
  pollId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
