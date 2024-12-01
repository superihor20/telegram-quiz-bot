import { Chat } from 'src/telegram/entities/chat.entity';

export interface QuestionChat {
  pollId: string;
  messageId: number;
  chat: Chat;
}
