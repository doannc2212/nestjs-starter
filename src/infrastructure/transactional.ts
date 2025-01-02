import { ICommandHandler, IEventHandler } from '@nestjs/cqrs';

import { writeActionManager } from './persistence/database/database.module';
import { RequestStorage } from './request-storage';

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
        if (writeActionManager.isTransactionActive)
          RequestStorage.increaseTransactionDepth();
        if (!writeActionManager.isTransactionActive) {
          RequestStorage.resetTransactionDepth();
          await writeActionManager.startTransaction();
        }
        try {
          const result = await proxyTarget.apply(thisArg, args);

          if (
            writeActionManager.isTransactionActive &&
            RequestStorage.getStorage().transactionDepth <= 0
          )
            await writeActionManager.commitTransaction();
          if (
            writeActionManager.isTransactionActive &&
            0 < RequestStorage.getStorage().transactionDepth
          )
            RequestStorage.decreaseTransactionDepth();
          return result;
        } catch (error) {
          if (
            writeActionManager.isTransactionActive &&
            RequestStorage.getStorage().transactionDepth <= 0
          )
            await writeActionManager.rollbackTransaction();
          if (
            writeActionManager.isTransactionActive &&
            0 < RequestStorage.getStorage().transactionDepth
          )
            RequestStorage.decreaseTransactionDepth();
          throw error;
        }
      },
    });
  };
}
