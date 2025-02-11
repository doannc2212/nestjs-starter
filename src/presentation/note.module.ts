import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteNoteHandler } from 'src/application/command/delete-note.handler';
import { CreateNoteHandler } from 'src/application/command/create-note.handler';
import { NoteDeletedHandler } from 'src/application/event/note-deleted.handler';
import { NoteCreatedHandler } from 'src/application/event/note-created.handler';
import { FindNoteByIdHandler } from 'src/application/query/find-note-by-id.handler';
import { NoteFactory } from 'src/domain/aggregate/note.factory';
import { InjectionToken } from 'src/infrastructure/injection';
import { NoteRepositoryImplementation } from 'src/infrastructure/persistence/repositories/note.repository.impl';
import { NoteController } from './grpc/note.grpc';
import { NoteResolver } from './graphql/note.resolver';

const application = [
  // query
  FindNoteByIdHandler,
  // command
  CreateNoteHandler,
  DeleteNoteHandler,
  // event
  NoteCreatedHandler,
  NoteDeletedHandler,
];

const domain = [NoteFactory];

const infrastructure = [
  {
    provide: InjectionToken.NoteRepository,
    useClass: NoteRepositoryImplementation,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [NoteController],
  providers: [...infrastructure, ...domain, ...application, NoteResolver],
})
export class NoteModule {}
