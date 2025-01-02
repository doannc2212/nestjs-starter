import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { CloseAccountCommand } from 'src/application/command/close-account.command';
import { OpenAccountCommand } from 'src/application/command/open-account.command';
import { FindAccountByIdQuery } from 'src/application/query/find-account-by-id.query';
import { Account } from './dtos/graphql';
import { OpenAccountDto } from './dtos/open-account.dto';

@Resolver('Account')
export class AccountResolver {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  @Query(() => Account, { name: 'Account' })
  async findAccountById(@Args('id') id: string): Promise<Account> {
    const query = new FindAccountByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Mutation()
  async openAccount(@Args('input') input: OpenAccountDto) {
    const command = new OpenAccountCommand(
      input.name,
      input.email,
      input.password,
    );
    await this.commandBus.execute(command);
  }

  @Mutation()
  async closeAccount(@Args('id') id: string) {
    const command = new CloseAccountCommand(id);
    await this.commandBus.execute(command);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    const query = new FindAccountByIdQuery(reference.id);
    return await this.queryBus.execute(query);
  }
}
