import { Chat } from 'src/telegram/entities/chat.entity';
import { WeeklyWinner } from 'src/weekly-winner/entities/weekly-winner.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegramId: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  name: string;

  @OneToMany(() => WeeklyWinner, (weeklyWinner) => weeklyWinner.user)
  weeklyWins: WeeklyWinner[];

  @Column({ default: 0 })
  streak: number;

  @ManyToMany(() => Chat, (chat) => chat.users, { cascade: true })
  @JoinTable({ name: 'user_chat' })
  chats: Chat[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
