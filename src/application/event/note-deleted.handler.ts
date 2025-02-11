import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NoteDeletedEvent } from 'src/domain/event/note-deleted.event';

@EventsHandler(NoteDeletedEvent)
export class NoteDeletedHandler implements IEventHandler<NoteDeletedEvent> {
  async handle(event: NoteDeletedEvent) {}
}
