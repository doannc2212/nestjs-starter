import { MiddlewareConsumer, Module } from '@nestjs/common';
import { graphQLModule } from './infrastructure/graphql.module';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { RequestStorageMiddleware } from './infrastructure/request-storage';
import { AccountModule } from './presentation/account.module';

// infrastructure
@Module({
  imports: [graphQLModule, DatabaseModule, AccountModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
