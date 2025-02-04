import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from 'src/domain/repositories/account.repository';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { InjectionToken } from 'src/infrastructure/injection';
import { Transactional } from 'src/infrastructure/transactional';
import { CloseAccountCommand } from './close-account.command';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(CloseAccountCommand)
export class CloseAccountHandler
  implements ICommandHandler<CloseAccountCommand, void>
{
  constructor(
    @Inject(InjectionToken.AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  @Transactional()
  async execute(command: CloseAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.id);
    if (!account) throw new RpcException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.close();

    await this.accountRepository.save(account);

    account.commit();
  }
}
