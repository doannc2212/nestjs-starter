import { Module, NestModule } from '@nestjs/common';
import { graphQLModule } from './infrastructure/graphql.module';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { AccountModule } from './presentation/account.module';

// infrastructure
@Module({
  imports: [graphQLModule, DatabaseModule, AccountModule],
})
export class AppModule implements NestModule {
  configure() {}
}
