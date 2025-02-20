// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v3.20.3
// source: recipe/schema.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "note";

/** Define scalar types */
export interface DateMessage {
  /** Use string to represent Date; could be in ISO8601 format or a timestamp */
  value: string;
}

export interface Void {
}

/** Note message (representing the GraphQL Note type) */
export interface Note {
  id: string;
  name: string;
  description: string;
}

/** Input for opening an note (GraphQL input type CreateNoteRequest) */
export interface CreateNoteRequest {
  name: string;
  description: string;
}

/** Meta information (GraphQL Meta type) */
export interface Meta {
  count: number;
}

/** Request for GetNote */
export interface FindNoteByIdRequest {
  id: string;
}

/** Request for DeleteNote */
export interface DeleteNoteRequest {
  id: string;
}

export const NOTE_PACKAGE_NAME = "note";

/** Define the service */

export interface NoteServiceClient {
  /** Query: Get note by ID */

  findNoteById(request: FindNoteByIdRequest, metadata?: Metadata): Observable<Note>;

  /** Mutation: Create a new note */

  createNote(request: CreateNoteRequest, metadata?: Metadata): Observable<Void>;

  /** Mutation: Delete a note */

  deleteNote(request: DeleteNoteRequest, metadata?: Metadata): Observable<Void>;
}

/** Define the service */

export interface NoteServiceController {
  /** Query: Get note by ID */

  findNoteById(request: FindNoteByIdRequest, metadata?: Metadata): Promise<Note> | Observable<Note> | Note;

  /** Mutation: Create a new note */

  createNote(request: CreateNoteRequest, metadata?: Metadata): Promise<Void> | Observable<Void> | Void;

  /** Mutation: Delete a note */

  deleteNote(request: DeleteNoteRequest, metadata?: Metadata): Promise<Void> | Observable<Void> | Void;
}

export function NoteServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findNoteById", "createNote", "deleteNote"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NoteService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NoteService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NOTE_SERVICE_NAME = "NoteService";
