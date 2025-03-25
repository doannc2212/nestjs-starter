#!/bin/bash

# Set variables
PROTO_DIR="./recipe"
OUT_DIR="./src/interface/grpc/specifications"
PROTOC="./node_modules/.bin/grpc_tools_node_protoc"
PLUGIN="./node_modules/.bin/protoc-gen-ts_proto"

# Create output directory if it doesn't exist
mkdir -p ${OUT_DIR}

# Generate TypeScript code
${PROTOC} \
    --plugin="protoc-gen-ts_proto=${PLUGIN}" \
    --ts_proto_out="${OUT_DIR}" \
    --ts_proto_opt=nestJs=true \
    --ts_proto_opt=addGrpcMetadata=true \
    --ts_proto_opt=emitImportedFiles=false \
    -I "${PROTO_DIR}" \
    "${PROTO_DIR}"/*.proto

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "✅ gRPC interfaces generated successfully"
else
    echo "❌ Failed to generate gRPC interfaces"
    exit 1
fi
