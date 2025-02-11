import { ICommand } from '@nestjs/cqrs';

export class CreateNoteCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly description: string | null,
  ) {}
}
