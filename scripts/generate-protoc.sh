protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. recipe/*.proto --ts_proto_opt=nestJs=true --ts_proto_opt=addGrpcMetadata=true --ts_proto_opt=emitImportedFiles=false;

mv recipe/schema.ts src/presentation/grpc/specifications;

echo "Protobuf files generated successfully"
