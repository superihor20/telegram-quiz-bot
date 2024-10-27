import { WeeklyWinner } from 'src/weekly-winner/entities/weekly-winner.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegram_id: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  name: string;

  @OneToMany(() => WeeklyWinner, (weeklyWinner) => weeklyWinner.user)
  weeklyWins: WeeklyWinner[];

  @Column({ default: 0 })
  streak: number;
}
