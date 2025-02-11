import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { InjectionToken } from 'src/infrastructure/injection';
import { Transactional } from 'src/infrastructure/transactional';
import { DeleteNoteCommand as DeleteNoteCommand } from './delete-note.command';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(DeleteNoteCommand)
export class DeleteNoteHandler
  implements ICommandHandler<DeleteNoteCommand, void>
{
  constructor(
    @Inject(InjectionToken.NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  @Transactional()
  async execute(command: DeleteNoteCommand): Promise<void> {
    const note = await this.noteRepository.findById(command.id);
    if (!note) throw new RpcException(ErrorMessage.NOTE_IS_NOT_FOUND);

    note.close();

    await this.noteRepository.save(note);

    note.commit();
  }
}
