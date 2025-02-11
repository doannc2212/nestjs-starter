import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NoteFactory } from 'src/domain/aggregate/note.factory';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { InjectionToken } from 'src/infrastructure/injection';
import { Transactional } from 'src/infrastructure/transactional';
import { CreateNoteCommand } from './create-note.command';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler
  implements ICommandHandler<CreateNoteCommand, void>
{
  constructor(
    @Inject(InjectionToken.NoteRepository)
    private readonly noteRepository: NoteRepository,
    @Inject() private readonly noteFactory: NoteFactory,
  ) {}

  @Transactional()
  async execute(command: CreateNoteCommand): Promise<void> {
    let note = await this.noteRepository.findByName(command.name);
    if (note) throw new RpcException(ErrorMessage.NOTE_IS_ALREADY_EXIST);

    note = this.noteFactory.create(command);

    await this.noteRepository.save(note);

    note.commit();
  }
}
