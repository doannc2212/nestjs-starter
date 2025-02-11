import { IEvent } from '@nestjs/cqrs';

export class NoteCreatedEvent implements IEvent {
  constructor(
    readonly noteId: string,
    readonly name: string,
    readonly description: string,
  ) {}
}
