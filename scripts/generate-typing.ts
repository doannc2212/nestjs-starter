import { GraphQLFederationDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLFederationDefinitionsFactory();
definitionsFactory
  .generate({
    typePaths: ['recipe/*.graphql'],
    path: join(process.cwd(), 'src/interface/graphql/dtos/graphql.ts'),
    outputAs: 'class',
  })
  .then(() => {
    console.log('✅ GraphQL types generated successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to generate GraphQL types');
    console.error(error);
    process.exit(1);
  });
