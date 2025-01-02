## Source code structure

Note that the tree below is the output of `rg --files | tree --fromfile`

```
.
├── bun.lockb
├── compose.yml
├── nest-cli.json
├── output
├── package.json
├── pnpm-lock.yaml
├── readme.md
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── application
│   │   ├── command
│   │   │   ├── create-post.command.ts
│   │   │   └── create-post.handler.ts
│   │   ├── event
│   │   │   └── post-created.handler.ts
│   │   └── query
│   │       ├── find-post-by-id.handler.ts
│   │       └── find-post-by-id.query.ts
│   ├── domain
│   │   ├── event
│   │   │   └── post-created.event.ts
│   │   └── repository.ts
│   ├── infrastructure
│   │   ├── common
│   │   │   ├── error.ts
│   │   │   └── interface.ts
│   │   ├── config
│   │   │   └── typeorm.ts
│   │   ├── persistence
│   │   │   └── database
│   │   │       └── entities
│   │   │           └── post.entity.ts
│   │   └── specification
│   │       ├── schema.graphql
│   │       └── schema.proto
│   ├── main.ts
│   └── presentation
│       ├── graphql
│       │   └── post.resolver.ts
│       ├── grpc
│       │   └── post.grpc.ts
│       └── post.module.ts
├── structure.md
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json

19 directories, 38 files

```

## Using for function

1. src/application: Application Layer: This layer contains application logic, which focuses on processing specific operations of the application.

2. src/domain: Domain Layer: This is the core layer of the application, where core concepts related to the business are defined. All important business logic will reside here.

3. src/presentation: Presentation Layer: This layer manages the interaction with external systems or users (e.g., via APIs or gRPC endpoints).

4. src/infrastructure: Infrastructure Layer: This layer handles technical implementations, such as integrations with external systems or databases.

5. app.module.ts: The root module file that ties all layers (application, domain, infrastructure, presentation) together.

## Using for unit test
