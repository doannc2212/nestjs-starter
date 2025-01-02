import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountFactory } from 'src/domain/aggregate/account.factory';
import { AccountRepository } from 'src/domain/repositories/account.repository';
import { ErrorMessage } from 'src/infrastructure/common/error-message';
import { InjectionToken } from 'src/infrastructure/injection';
import { Transactional } from 'src/infrastructure/transactional';
import { OpenAccountCommand } from './open-account.command';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(OpenAccountCommand)
export class OpenAccountHandler
  implements ICommandHandler<OpenAccountCommand, void>
{
  constructor(
    @Inject(InjectionToken.AccountRepository)
    private readonly accountRepository: AccountRepository,
    @Inject() private readonly accountFactory: AccountFactory,
  ) {}

  @Transactional()
  async execute(command: OpenAccountCommand): Promise<void> {
    let account = await this.accountRepository.findByEmail(command.email);
    if (account) throw new RpcException(ErrorMessage.ACCOUNT_IS_ALREADY_EXIST);

    account = this.accountFactory.create(command);

    await this.accountRepository.save(account);

    account.commit();
  }
}
