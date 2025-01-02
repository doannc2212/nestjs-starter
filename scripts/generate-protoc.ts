const path = 'recipe/*.proto';
const out = 'src/presentation/grpc/specifications';

const script = `protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. ${path} --ts_proto_opt=nestJs=true --ts_proto_opt=addGrpcMetadata=true --ts_proto_opt=emitImportedFiles=false`;

import { exec } from 'child_process';

exec(`bun run ${script}`, (error) => {
  if (error) {
    console.error(error);
    return;
  }
  // success, move it to src/presentation/grpc/interfaces
  exec(
    `mv recipe/*.ts ${out}`, //this script cannot fail
    (error) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Generated proto files successfully and placed in ${out}`);
    },
  );
});
