import { ICommand } from '@nestjs/cqrs';

export class RemoveItemCommand implements ICommand {
  constructor(
    readonly orderId: string,
    readonly itemId: string,
  ) {}
}
