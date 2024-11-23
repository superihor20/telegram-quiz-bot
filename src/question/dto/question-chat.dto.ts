import { Chat } from 'src/telegram/entities/chat.entity';

export type QuestionChatDto = {
  pollId: string;
  messageId: number;
  chat: Chat;
};
