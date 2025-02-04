import { AggregateRoot } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { AccountClosedEvent } from '../event/account-closed.event';
import { AccountOpenedEvent } from '../event/account-opened.event';

export type AccountEssentialProperties = Readonly<
  Required<{
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>
>;

export type AccountOptionalProperties = Readonly<
  Partial<{
    lockedAt: Date | null;
  }>
>;

export type AccountProperties = AccountEssentialProperties &
  // required for future parsing with Account entity, e.g in account.repository.impl.ts
  Required<AccountOptionalProperties>;

export interface Account {
  open: () => void;
  close: () => void;
  // aggreegate root impl https://github.com/nestjs/cqrs/blob/master/src/aggregate-root.ts#L46-L52
  commit: () => void;
}

export class AccountImplement extends AggregateRoot implements Account {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;
  private readonly password: string;
  private lockedAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: AccountProperties) {
    super();
    Object.assign(this, props);
  }

  open(): void {
    this.apply(new AccountOpenedEvent(this.id, this.email));
  }

  close(): void {
    if (this.lockedAt) throw new RpcException(ErrorMessage.ACCOUNT_IS_LOCKED);

    this.lockedAt = new Date();

    this.apply(new AccountClosedEvent(this.id, this.email));
  }
}
