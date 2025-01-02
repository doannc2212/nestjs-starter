import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { v4 } from 'uuid';
import { Account, AccountImplement, AccountProperties } from './account';

type CreateAccountOptions = {
  name: string;
  email: string;
  password: string;
};

export class AccountFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateAccountOptions): Account {
    // https://github.com/nestjs/cqrs/blob/master/src/event-publisher.ts#L37-L56
    return this.eventPublisher.mergeObjectContext(
      new AccountImplement({
        id: v4(),
        name: options.name,
        email: options.email,
        password: options.password,
        lockedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
  }

  reconstitute(props: AccountProperties): Account {
    return this.eventPublisher.mergeObjectContext(new AccountImplement(props));
  }
}
