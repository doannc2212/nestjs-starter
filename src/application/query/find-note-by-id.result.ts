import { IQueryResult } from '@nestjs/cqrs';

export class FindNoteByIdResult implements IQueryResult {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly lockedAt: Date | null;

  // TODO: remove `any` type
  static from(data: any): FindNoteByIdResult {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      lockedAt: data.lockedAt,
    };
  }
}
