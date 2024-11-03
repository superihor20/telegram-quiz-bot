import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { QuestionService } from 'src/question/question.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { createCanvas } from 'canvas';
import { CommandService } from './command.service';
import { EventService } from './event.service';
import { Reflector } from '@nestjs/core';
import { COMMAND_HANDLER_KEY } from 'src/decorators/command-handler.decorator';
import { EVENT_HANDLER_KEY } from 'src/decorators/event-handler.decorator';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(
    private readonly questionService: QuestionService,
    private readonly appConfigService: AppConfigService,
    private readonly commandService: CommandService,
    private readonly eventService: EventService,
    private readonly reflector: Reflector,
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
    await this.bot.telegram.sendPhoto(this.appConfigService.telegramChatId, {
      source: image,
    });

    const quiz = await this.bot.telegram.sendQuiz(
      this.appConfigService.telegramChatId,
      'Оберіть правильну відповідь:',
      answers,
      {
        explanation: explanation,
        is_anonymous: false,
        correct_option_id: correctAnswer,
      },
    );

    await this.questionService.update(questionId, {
      pollId: quiz.poll.id,
      messageId: quiz.message_id,
      isPublished: true,
    });

    await this.bot.telegram.pinChatMessage(
      this.appConfigService.telegramChatId,
      quiz.message_id,
    );
  }

  async createImageWithText(text: string) {
    const width = 500;
    const height = 300;
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
