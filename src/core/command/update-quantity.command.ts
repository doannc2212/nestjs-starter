import { ICommand } from '@nestjs/cqrs';

export class UpdateQuantityCommand implements ICommand {
  constructor(
    readonly orderId: string,
    readonly itemId: string,
    readonly quantity: number,
  ) {}
}
