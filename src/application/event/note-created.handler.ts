import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NoteCreatedEvent } from 'src/domain/event/note-created.event';

@EventsHandler(NoteCreatedEvent)
export class NoteCreatedHandler implements IEventHandler<NoteCreatedEvent> {
  async handle(event: NoteCreatedEvent) {}
}
