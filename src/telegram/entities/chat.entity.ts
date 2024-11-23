import { Result } from 'src/result/entities/result.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  chatId: bigint;

  @ManyToMany(() => User, (user) => user.chats)
  users: User[];

  @OneToMany(() => Result, (result) => result.chat)
  results: Result;
}
