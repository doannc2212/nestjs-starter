import { ICommand } from '@nestjs/cqrs';

export class DeleteNoteCommand implements ICommand {
  constructor(readonly id: string) {}
}
