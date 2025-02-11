import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { v4 } from 'uuid';
import { Note, NoteImplement, NoteProperties } from './note';

type CreateNoteOptions = {
  name: string;
  description: string | null;
};

export class NoteFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateNoteOptions): Note {
    // https://github.com/nestjs/cqrs/blob/master/src/event-publisher.ts#L37-L56
    return this.eventPublisher.mergeObjectContext(
      new NoteImplement({
        id: v4(),
        name: options.name,
        description: options.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
  }

  reconstitute(props: NoteProperties): Note {
    return this.eventPublisher.mergeObjectContext(new NoteImplement(props));
  }
}
