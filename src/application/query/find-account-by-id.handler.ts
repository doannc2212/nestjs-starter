import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { AccountRepository } from 'src/domain/repositories/account.repository';
import { ErrorMessage } from 'src/infrastructure/error-message';
import { InjectionToken } from 'src/infrastructure/injection';
import { FindAccountByIdQuery } from './find-account-by-id.query';
import { FindAccountByIdResult } from './find-account-by-id.result';

@QueryHandler(FindAccountByIdQuery)
export class FindAccountByIdHandler
  implements IQueryHandler<FindAccountByIdQuery, FindAccountByIdResult>
{
  constructor(
    @Inject(InjectionToken.AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(query: FindAccountByIdQuery): Promise<FindAccountByIdResult> {
    const data = await this.accountRepository.findById(query.id);
    if (!data) throw new RpcException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    return FindAccountByIdResult.from(data);
  }
}
