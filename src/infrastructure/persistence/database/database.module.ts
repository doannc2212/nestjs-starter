import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connectionSource } from './datasource/typeorm';
import { EntityManager, QueryRunner } from 'typeorm';

interface WriteActionManager
  extends Pick<
    QueryRunner,
    | 'startTransaction'
    | 'commitTransaction'
    | 'rollbackTransaction'
    | 'isTransactionActive'
    | 'manager'
  > {}

interface ReadActionManager
  extends Pick<
    EntityManager,
    'query' | 'createQueryBuilder' | 'getRepository'
  > {}

export let writeActionManager = {} as WriteActionManager;
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
