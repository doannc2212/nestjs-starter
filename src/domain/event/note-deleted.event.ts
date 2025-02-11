import { IEvent } from '@nestjs/cqrs';

export class NoteDeletedEvent implements IEvent {
  constructor(
    readonly noteId: string,
    readonly name: string,
  ) {}
}
