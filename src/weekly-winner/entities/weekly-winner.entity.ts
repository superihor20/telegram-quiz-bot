import { Chat } from 'src/telegram/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class WeeklyWinner {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.weeklyWinners)
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}
