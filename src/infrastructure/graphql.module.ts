import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLDate, GraphQLVoid } from 'graphql-scalars';
import { join } from 'path';

let definitions = undefined;
if (process.env.NODE_ENV !== 'production')
  definitions = {
    path: join(process.cwd(), 'src/presentation/graphql/dtos/graphql.ts'),
    outputAs: 'class',
  };

export const graphQLModule =
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    typePaths: ['./recipe/**/*.graphql'],
    resolvers: { Date: GraphQLDate, Void: GraphQLVoid },
    definitions,
    includeStacktraceInErrorResponses: false,
  });
