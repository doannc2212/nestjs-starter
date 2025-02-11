import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { InjectionToken } from 'src/infrastructure/injection';
import { FindNoteByIdQuery } from './find-note-by-id.query';
import { FindNoteByIdResult } from './find-note-by-id.result';

@QueryHandler(FindNoteByIdQuery)
export class FindNoteByIdHandler
  implements IQueryHandler<FindNoteByIdQuery, FindNoteByIdResult>
{
  constructor(
    @Inject(InjectionToken.NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(query: FindNoteByIdQuery): Promise<FindNoteByIdResult> {
    const data = await this.noteRepository.findById(query.id);
    if (!data) throw new RpcException(ErrorMessage.NOTE_IS_NOT_FOUND);

    return FindNoteByIdResult.from(data);
  }
}
