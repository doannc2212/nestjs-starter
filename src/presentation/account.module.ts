import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CloseAccountHandler } from 'src/application/command/close-account.handler';
import { OpenAccountHandler } from 'src/application/command/open-account.handler';
import { AccountClosedHandler } from 'src/application/event/account-closed.handler';
import { AccountOpenedHandler } from 'src/application/event/account-opened.handler';
import { FindAccountByIdHandler } from 'src/application/query/find-account-by-id.handler';
import { AccountFactory } from 'src/domain/aggregate/account.factory';
import { InjectionToken } from 'src/infrastructure/injection';
import { AccountRepositoryImplementation } from 'src/infrastructure/persistence/repositories/account.repository.impl';
import { AccountResolver } from './graphql/account.resolver';
import { AccountController } from './grpc/account.grpc';

const application = [
  // query
  FindAccountByIdHandler,
  // command
  OpenAccountHandler,
  CloseAccountHandler,
  // event
  AccountOpenedHandler,
  AccountClosedHandler,
];

const domain = [AccountFactory];

const infrastructure = [
  {
    provide: InjectionToken.AccountRepository,
    useClass: AccountRepositoryImplementation,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [AccountController],
  providers: [...infrastructure, ...domain, ...application, AccountResolver],
})
export class AccountModule {}
