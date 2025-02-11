import { AggregateRoot } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { NoteDeletedEvent } from '../event/note-deleted.event';
import { NoteCreatedEvent } from '../event/note-created.event';

export type NoteEssentialProperties = Readonly<
  Required<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>
>;

export type NoteOptionalProperties = Readonly<
  Partial<{
    description: string | null;
  }>
>;

export type NoteProperties = NoteEssentialProperties &
  // required for future parsing with Note entity, e.g in note.repository.impl.ts
  Required<NoteOptionalProperties>;

export interface Note {
  open: () => void;
  close: () => void;
  // aggregate root impl https://github.com/nestjs/cqrs/blob/master/src/aggregate-root.ts#L46-L52
  commit: () => void;
}

export class NoteImplement extends AggregateRoot implements Note {
  private readonly id: string;
  private readonly name: string;
  private description: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(props: NoteProperties) {
    super();
    Object.assign(this, props);
  }

  open(): void {
    this.apply(new NoteCreatedEvent(this.id, this.name, this.description));
  }

  close(): void {
    if (this.deletedAt) throw new RpcException(ErrorMessage.NOTE_IS_DELETED);

    this.deletedAt = new Date();

    this.apply(new NoteDeletedEvent(this.id, this.name));
  }
}
