import { GraphQLFederationDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLFederationDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['recipe/*.graphql'],
  path: join(process.cwd(), 'src/presentation/graphql/dtos/graphql.ts'),
  outputAs: 'class',
});
