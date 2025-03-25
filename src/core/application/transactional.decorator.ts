import { ICommandHandler, IEventHandler } from '@nestjs/cqrs';
import { writeActionManager } from '../../infrastructure/database/database.module';

export function Transactional() {
  return (
    _: ICommandHandler | IEventHandler,
    ___: string,
    descriptor: PropertyDescriptor,
  ): void => {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>;
    descriptor.value = new Proxy(originalMethod, {
      apply: async (proxyTarget, thisArg, args) => {
        await writeActionManager.startTransaction();
        try {
          const result = await proxyTarget.apply(thisArg, args);
          if (writeActionManager.isTransactionActive) {
            await writeActionManager.commitTransaction();
          }

          return result;
        } catch (error) {
          if (writeActionManager.isTransactionActive) {
            await writeActionManager.rollbackTransaction();
          }

          throw error;
        }
      },
    });
  };
}
