import { NestMiddleware } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 } from 'uuid';

class Storage {
  constructor(
    readonly requestId = v4(),
    readonly transactionDepth = 0,
  ) {}
}

interface RequestStorage {
  reset: () => void;
  resetTransactionDepth: () => void;
  increaseTransactionDepth: () => void;
  decreaseTransactionDepth: () => void;
  setRequestId: (requestId: string) => void;
}

// TODO: for tracing
class RequestStorageImplement implements RequestStorage {
  private readonly storage = new AsyncLocalStorage<Storage>();

  reset(): void {
    this.storage.enterWith(new Storage());
  }

  resetTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({ ...storage, transactionDepth: 0 });
  }

  increaseTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({
      ...storage,
      transactionDepth: storage.transactionDepth + 1,
    });
  }

  decreaseTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({
      ...storage,
      transactionDepth: storage.transactionDepth - 1,
    });
  }

  setRequestId(requestId: string): void {
    const storage = this.getStorage();
    this.storage.enterWith({ ...storage, requestId });
  }

  getStorage(): Storage {
    const storage = this.storage.getStore();
    if (!storage) throw new RpcException('RequestStorage is not found');
    return storage;
  }
}

export const RequestStorage = new RequestStorageImplement();

export class RequestStorageMiddleware implements NestMiddleware {
  use(
    request: Request,
    response: Response,
    next: (error?: object) => void,
  ): void {
    RequestStorage.reset();
    next();
  }
}
