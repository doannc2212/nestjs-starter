
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateNoteInput {
    name: string;
    description?: Nullable<string>;
}

export class Note {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class Meta {
    count?: Nullable<number>;
}

export abstract class IQuery {
    abstract Note(id: string): Nullable<Note> | Promise<Nullable<Note>>;
}

export abstract class IMutation {
    abstract createNote(input: CreateNoteInput): Nullable<Void> | Promise<Nullable<Void>>;

    abstract deleteNote(id: string): Nullable<Void> | Promise<Nullable<Void>>;
}

export type Void = any;
type Nullable<T> = T | null;
