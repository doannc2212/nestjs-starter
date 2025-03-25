import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import fs from 'fs';

try {
  const loadedFiles = loadFilesSync('./recipe/*.graphql');
  const typeDefs = mergeTypeDefs(loadedFiles);
  const printedTypeDefs = print(typeDefs);
  const outputName = 'merged.graphql';

  fs.writeFileSync(outputName, printedTypeDefs);
  console.log('✅ GraphQL schema merged successfully');
} catch (error) {
  console.error('❌ Failed to merge GraphQL schema');
  console.error(error);
  process.exit(1);
}
