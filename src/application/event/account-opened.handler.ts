import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountOpenedEvent } from 'src/domain/event/account-opened.event';

@EventsHandler(AccountOpenedEvent)
export class AccountOpenedHandler implements IEventHandler<AccountOpenedEvent> {
  async handle(event: AccountOpenedEvent) {}
}
