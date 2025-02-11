import { Inject } from '@nestjs/common';
import { Note, NoteProperties } from 'src/domain/aggregate/note';
import { NoteFactory } from 'src/domain/aggregate/note.factory';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { writeActionManager } from '../database/database.module';
import { NoteEntity } from '../database/entities/note.entity';

export class NoteRepositoryImplementation implements NoteRepository {
  @Inject() private readonly noteFactory: NoteFactory;

  async save(note: Note | Note[]): Promise<void> {
    const models = Array.isArray(note) ? note : [note];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeActionManager.manager.getRepository(NoteEntity).save(entities);
  }

  async findById(id: string): Promise<Note | null> {
    const entity = await writeActionManager.manager
      .getRepository(NoteEntity)
      .findOneBy({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByName(name: string): Promise<Note | null> {
    const entity = await writeActionManager.manager
      .getRepository(NoteEntity)
      .findOneBy({ name });
    return entity ? this.entityToModel(entity) : null;
  }

  private modelToEntity(model: Note): NoteEntity {
    // remove unwanted properties
    const properties = JSON.parse(JSON.stringify(model)) as NoteProperties;
    return {
      ...properties,
      id: properties.id,
      description: properties.description,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
      deletedAt: properties.deletedAt,
    };
  }

  private entityToModel(entity: NoteEntity): Note {
    return this.noteFactory.reconstitute(entity);
  }
}
