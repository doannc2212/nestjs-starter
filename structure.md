## Source code structure

Note that the tree below is the output of `rg --files | tree --fromfile`

```
.
├── bun.lock
├── commitlint.config.ts
├── compose.yml
├── Dockerfile
├── nest-cli.json
├── node.Dockerfile
├── package.json
├── readme.md
├── recipe
│   ├── schema.graphql
│   └── schema.proto
├── scripts
│   ├── generate-protoc.sh
│   ├── generate-schema.ts
│   └── generate-typing.ts
├── src
│   ├── app.module.ts
│   ├── core
│   │   ├── application
│   │   │   ├── command
│   │   │   │   ├── add-item.handler.spec.ts
│   │   │   │   ├── add-item.handler.ts
│   │   │   │   ├── close-order.handler.spec.ts
│   │   │   │   ├── close-order.handler.ts
│   │   │   │   ├── create-order.handler.spec.ts
│   │   │   │   ├── create-order.handler.ts
│   │   │   │   ├── remove-item.handler.spec.ts
│   │   │   │   ├── remove-item.handler.ts
│   │   │   │   ├── update-quantity.handler.spec.ts
│   │   │   │   └── update-quantity.handler.ts
│   │   │   ├── error-message.ts
│   │   │   ├── event
│   │   │   │   ├── order-closed.handler.ts
│   │   │   │   ├── order-item-added.handler.ts
│   │   │   │   ├── order-item-removed.handler.ts
│   │   │   │   └── order-quantity-updated.handler.ts
│   │   │   ├── query
│   │   │   │   ├── find-order-by-id.handler.spec.ts
│   │   │   │   └── find-order-by-id.handler.ts
│   │   │   └── transactional.decorator.ts
│   │   ├── command
│   │   │   ├── add-item.command.ts
│   │   │   ├── close-order.command.ts
│   │   │   ├── create-order.command.ts
│   │   │   ├── remove-item.command.ts
│   │   │   └── update-quantity.command.ts
│   │   ├── domain
│   │   │   ├── aggregate
│   │   │   │   ├── order-item.ts
│   │   │   │   └── order.ts
│   │   │   ├── event
│   │   │   │   ├── order-closed.event.ts
│   │   │   │   ├── order-item-added.event.ts
│   │   │   │   ├── order-item-removed.event.ts
│   │   │   │   └── order-quantity-updated.event.ts
│   │   │   ├── factory
│   │   │   │   └── order.factory.ts
│   │   │   └── repository
│   │   │       └── order.repository.ts
│   │   └── query
│   │       └── find-order-by-id.query.ts
│   ├── graphql.module.ts
│   ├── infrastructure
│   │   ├── database
│   │   │   ├── database.module.ts
│   │   │   ├── datasource
│   │   │   │   └── typeorm.ts
│   │   │   ├── entities
│   │   │   │   ├── base.entity.ts
│   │   │   │   ├── order.entity.ts
│   │   │   │   └── order-item.entity.ts
│   │   │   ├── migrations
│   │   │   │   └── 1742557235367-initial.ts
│   │   │   └── seeds
│   │   │       ├── order-item.seed.ts
│   │   │       ├── order.seed.ts
│   │   │       ├── seed.ts
│   │   │       └── unseed.ts
│   │   └── repository
│   │       └── order.repository.impl.ts
│   ├── injection-token.ts
│   ├── interface
│   │   ├── graphql
│   │   │   ├── dtos
│   │   │   │   └── graphql.ts
│   │   │   ├── order.resolver.spec.ts
│   │   │   └── order.resolver.ts
│   │   ├── grpc
│   │   │   ├── order.grpc.spec.ts
│   │   │   ├── order.grpc.ts
│   │   │   └── specifications
│   │   │       └── schema.ts
│   │   └── rest
│   │       ├── dto
│   │       │   ├── add-item.request.dto.ts
│   │       │   ├── create-order.request.dto.ts
│   │       │   └── update-quantity.request.dto.ts
│   │       ├── order.controller.spec.ts
│   │       └── order.controller.ts
│   └── main.ts
├── structure.md
├── test
│   ├── jest-e2e.json
│   ├── jest-e2e.setup.ts
│   ├── order.graphql.e2e-spec.ts
│   └── setup-data.ts
├── tsconfig.build.json
└── tsconfig.json

31 directories, 78 files
```

## Using for function

1. src/application: Application Layer: This layer contains application logic, which focuses on processing specific operations of the application.

2. src/domain: Domain Layer: This is the core layer of the application, where core concepts related to the business are defined. All important business logic will reside here.

3. src/presentation: Presentation Layer: This layer manages the interaction with external systems or users (e.g., via APIs or gRPC endpoints).

4. src/infrastructure: Infrastructure Layer: This layer handles technical implementations, such as integrations with external systems or databases.

5. app.module.ts: The root module file that ties all layers (application, domain, infrastructure, presentation) together.

## Using for unit test
