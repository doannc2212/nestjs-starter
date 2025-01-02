import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountClosedEvent } from 'src/domain/event/account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler<AccountClosedEvent> {
  async handle(event: AccountClosedEvent) {}
}
