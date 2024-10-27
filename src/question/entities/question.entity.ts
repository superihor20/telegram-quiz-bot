import { Answer } from 'src/answer/entities/answer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  pollId?: string;

  @Column({ nullable: true })
  messageId?: number;

  @UpdateDateColumn({ type: 'datetime' })
  lastUpdated: Date;
}
