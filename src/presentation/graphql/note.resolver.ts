import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { DeleteNoteCommand } from 'src/application/command/delete-note.command';
import { CreateNoteCommand } from 'src/application/command/create-note.command';
import { FindNoteByIdQuery } from 'src/application/query/find-note-by-id.query';
import { Note } from './dtos/graphql';
import { CreateNoteDto } from './dtos/create-note.dto';

@Resolver('Note')
export class NoteResolver {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  @Query(() => Note, { name: 'Note' })
  async findNoteById(@Args('id') id: string): Promise<Note> {
    const query = new FindNoteByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Mutation()
  async createNote(@Args('input') input: CreateNoteDto) {
    const command = new CreateNoteCommand(input.name, input.description);
    await this.commandBus.execute(command);
  }

  @Mutation()
  async deleteNote(@Args('id') id: string) {
    const command = new DeleteNoteCommand(id);
    await this.commandBus.execute(command);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    const query = new FindNoteByIdQuery(reference.id);
    return await this.queryBus.execute(query);
  }
}
