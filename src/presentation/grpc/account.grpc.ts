import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CloseAccountCommand } from 'src/application/command/close-account.command';
import { OpenAccountCommand } from 'src/application/command/open-account.command';
import { FindAccountByIdQuery } from 'src/application/query/find-account-by-id.query';
import {
  AccountServiceControllerMethods,
  CloseAccountRequest,
  FindAccountByIdRequest,
  OpenAccountRequest,
} from './specifications/schema';

// https://github.com/stephenh/ts-proto/blob/main/NESTJS.markdown
@Controller('account')
@AccountServiceControllerMethods()
export class AccountController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  async findAccountById(data: FindAccountByIdRequest) {
    const query = new FindAccountByIdQuery(data.id);
    return await this.queryBus.execute(query);
  }

  async openAccount(data: OpenAccountRequest) {
    const command = new OpenAccountCommand(
      data.name,
      data.email,
      data.password,
    );
    await this.commandBus.execute(command);
  }

  async closeAccount(data: CloseAccountRequest) {
    const command = new CloseAccountCommand(data.id);
    await this.commandBus.execute(command);
  }
}
