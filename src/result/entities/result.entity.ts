import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Answer)
  answer: Answer;

  @Column()
  is_correct: boolean;
}
