import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connectionSource } from './datasource/typeorm';
import { EntityManager, QueryRunner } from 'typeorm';

type WriteActionManager = Pick<
  QueryRunner,
  | 'startTransaction'
  | 'commitTransaction'
  | 'rollbackTransaction'
  | 'isTransactionActive'
  | 'manager'
>;

type ReadActionManager = Pick<
  EntityManager,
  'query' | 'createQueryBuilder' | 'getRepository'
>;

// because this cannot be unavailable
export let writeActionManager = {} as WriteActionManager;
// TODO: change to mongodb instead of postgres
export let readActionManager = {} as ReadActionManager;

class DatabaseService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await connectionSource.initialize();
    if (!connectionSource.isInitialized)
      throw new Error('Database connection failed');
    writeActionManager = connectionSource.createQueryRunner();
    readActionManager = connectionSource.manager;
  }

  async onModuleDestroy() {
    await connectionSource.destroy();
  }
}

@Global()
@Module({
  providers: [DatabaseService],
})
export class DatabaseModule {}
