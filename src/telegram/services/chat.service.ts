import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async save(chatId: bigint) {
    const chat = await this.chatRepository.findOne({
      where: { chatId },
    });

    if (!chat) {
      await this.chatRepository.save({ chatId });
    }
  }

  async find(chatId: bigint) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { chatId },
      });

      if (chat) {
        return chat;
      }

      throw new NotFoundException('Chat not found');
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll() {
    try {
      const chats = await this.chatRepository.find();

      return chats;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  create(chatId: bigint) {
    try {
      return this.chatRepository.create({ chatId });
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }
}
