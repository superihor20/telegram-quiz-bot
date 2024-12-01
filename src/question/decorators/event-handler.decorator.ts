import { SetMetadata } from '@nestjs/common';

export const EVENT_HANDLER_KEY = 'EVENT_HANDLER_KEY';
export const EventHandler = (eventType: string) =>
  SetMetadata(EVENT_HANDLER_KEY, eventType);
