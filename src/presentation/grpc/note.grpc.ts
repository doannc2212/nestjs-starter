import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteNoteCommand } from 'src/application/command/delete-note.command';
import { CreateNoteCommand } from 'src/application/command/create-note.command';
import { FindNoteByIdQuery } from 'src/application/query/find-note-by-id.query';
import {
  CreateNoteRequest,
  DeleteNoteRequest,
  FindNoteByIdRequest,
  NoteServiceControllerMethods,
} from './specifications/schema';

// https://github.com/stephenh/ts-proto/blob/main/NESTJS.markdown
@Controller('note')
@NoteServiceControllerMethods()
export class NoteController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  async findNoteById(data: FindNoteByIdRequest) {
    const query = new FindNoteByIdQuery(data.id);
    return await this.queryBus.execute(query);
  }

  async createNote(data: CreateNoteRequest) {
    const command = new CreateNoteCommand(data.name, data.description);
    await this.commandBus.execute(command);
  }

  async deleteNote(data: DeleteNoteRequest) {
    const command = new DeleteNoteCommand(data.id);
    await this.commandBus.execute(command);
  }
}
