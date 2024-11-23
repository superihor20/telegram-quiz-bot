import { SetMetadata } from '@nestjs/common';

export const COMMAND_HANDLER_KEY = 'COMMAND_HANDLER_KEY';
export const CommandHandler = (command: string) =>
  SetMetadata(COMMAND_HANDLER_KEY, command);
