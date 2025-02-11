import { Note } from '../aggregate/note';

export class NoteRepository {
  save: (note: Note | Note[]) => Promise<void>;
  findById: (id: string) => Promise<Note | null>;
  findByName: (id: string) => Promise<Note | null>;
}
