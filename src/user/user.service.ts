import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | null> {
    try {
      return this.userRepository.findOne({
        where: { telegram_id: telegramId },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return this.userRepository.findOne({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async createUser(
    telegramId: string,
    name: string,
    username?: string,
  ): Promise<User> {
    try {
      const user = this.userRepository.create({
        telegram_id: telegramId,
        name,
        username,
      });

      return this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(user: User): Promise<void> {
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
