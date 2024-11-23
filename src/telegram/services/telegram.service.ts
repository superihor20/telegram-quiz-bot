import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { QuestionService } from 'src/question/question.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { createCanvas } from 'canvas';
import { CommandService } from './command.service';
import { EventService } from './event.service';
import { Reflector } from '@nestjs/core';
import { COMMAND_HANDLER_KEY } from 'src/common/decorators/command-handler.decorator';
import { EVENT_HANDLER_KEY } from 'src/common/decorators/event-handler.decorator';
import { ChatService } from './chat.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(
    private readonly questionService: QuestionService,
    private readonly appConfigService: AppConfigService,
    private readonly commandService: CommandService,
    private readonly eventService: EventService,
    private readonly reflector: Reflector,
    private readonly chatService: ChatService,
  ) {
    this.bot = new Telegraf(this.appConfigService.telegramBotToken);
    this.registerMiddlewares();
    this.registerCommands();
    this.registerEventHandlers();
    this.bot.launch();
  }

  private registerCommands() {
    const commandHandlers = Object.getOwnPropertyNames(
      CommandService.prototype,
    );

    commandHandlers.forEach((handler) => {
      const command = this.reflector.get<string>(
        COMMAND_HANDLER_KEY,
        this.commandService[handler],
      );

      if (command) {
        this.bot.command(command, (ctx) => this.commandService[handler](ctx));
      }
    });
  }

  private registerEventHandlers() {
    const eventHandlers = Object.getOwnPropertyNames(EventService.prototype);

    eventHandlers.forEach((handler) => {
      const eventType = this.reflector.get(
        EVENT_HANDLER_KEY,
        this.eventService[handler],
      );

      if (eventType) {
        this.bot.on(eventType, (ctx) => this.eventService[handler](ctx));
      }
    });
  }

  private registerMiddlewares() {
    this.bot.use((ctx, next) => {
      if (ctx.chat && ctx.chat.type === 'private') {
        return;
      }

      return next();
    });
  }

  async sendQuiz(
    chatId: bigint,
    questionId: number,
    question: string,
    answers: string[],
    correctAnswer: number,
    explanation: string,
    code: string,
  ) {
    const image = await this.createImageWithText(
      code ? `${question}\n${code}` : `${question}`,
    );
    await this.bot.telegram.sendPhoto(chatId.toString(), {
      source: image,
    });

    const quiz = await this.bot.telegram.sendQuiz(
      chatId.toString(),
      'Оберіть правильну відповідь:',
      answers,
      {
        explanation:
          explanation.length > 198
            ? 'Запитайте, бо пояснення довге'
            : explanation,
        is_anonymous: false,
        correct_option_id: correctAnswer,
      },
    );

    const chat = await this.chatService.find(BigInt(quiz.chat.id));

    await this.questionService.update(questionId, {
      pollId: quiz.poll.id,
      messageId: quiz.message_id,
      chat,
    });

    await this.bot.telegram.pinChatMessage(chatId.toString(), quiz.message_id);
  }

  async createImageWithText(text: string) {
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    let fontSize = 30;
    context.font = `${fontSize}px Arial`;
    const lines = text.split('\n');

    while (
      lines.some((line) => context.measureText(line).width > width - 40) &&
      fontSize > 10
    ) {
      fontSize -= 2;
      context.font = `${fontSize}px Arial`;
    }

    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#ffe400';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    const lineHeight = fontSize * 1.2;
    const textHeight = lineHeight * lines.length;
    const startY = (height - textHeight) / 2 + lineHeight / 2; // Center the text block vertically

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      context.fillText(line, 20, y);
    });

    return canvas.toBuffer();
  }
}
