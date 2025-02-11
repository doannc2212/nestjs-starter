import { Module, NestModule } from '@nestjs/common';
import { graphQLModule } from './infrastructure/graphql.module';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { NoteModule } from './presentation/note.module';

// infrastructure
@Module({
  imports: [graphQLModule, DatabaseModule, NoteModule],
})
export class AppModule implements NestModule {
  configure() {}
}
