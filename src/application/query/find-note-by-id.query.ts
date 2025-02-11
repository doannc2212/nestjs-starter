import { IQuery } from '@nestjs/cqrs';

export class FindNoteByIdQuery implements IQuery {
  constructor(readonly id: string) {}
}
