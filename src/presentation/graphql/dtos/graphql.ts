
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class OpenAccountInput {
    name: string;
    email: string;
    password: string;
}

export class Account {
    id: string;
    name: string;
    email: string;
    password: string;
    lockedAt?: Nullable<Date>;
}

export class Meta {
    count?: Nullable<number>;
}

export abstract class IQuery {
    abstract Account(id: string): Nullable<Account> | Promise<Nullable<Account>>;
}

export abstract class IMutation {
    abstract openAccount(input: OpenAccountInput): Nullable<Void> | Promise<Nullable<Void>>;

    abstract closeAccount(id: string): Nullable<Void> | Promise<Nullable<Void>>;
}

export type Void = any;
type Nullable<T> = T | null;
