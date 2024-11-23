import { Answer } from 'src/answer/entities/answer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { QuestionChat } from './question-chat.entity';
import { QuestionType } from 'src/common/enum/question-type';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column({ nullable: true })
  explanation: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @OneToMany(() => QuestionChat, (questionChat) => questionChat.question)
  questionChats: QuestionChat[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
